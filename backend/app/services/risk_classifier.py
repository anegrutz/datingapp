"""EU AI Act risk classification engine.

Implements the decision logic of Regulation (EU) 2024/1689:

1. Article 5   — prohibited AI practices ("unacceptable risk")
2. Article 6(1) / Annex I  — high-risk: safety components of regulated products
3. Article 6(2) / Annex III — high-risk: stand-alone systems in listed areas,
   subject to the Article 6(3) derogation for narrow/preparatory tasks
4. Article 50  — transparency obligations ("limited risk")
5. Everything else — minimal risk

The classifier is deliberately conservative: any ambiguity resolves to the
higher risk tier, and every verdict carries the legal provisions that
triggered it so the output is auditable.
"""

from __future__ import annotations

import enum
from dataclasses import dataclass, field

from pydantic import BaseModel, Field


class RiskTier(str, enum.Enum):
    UNACCEPTABLE = "unacceptable"
    HIGH = "high"
    LIMITED = "limited"
    MINIMAL = "minimal"


class AnnexIIIArea(str, enum.Enum):
    """The eight high-risk areas of Annex III."""

    BIOMETRICS = "biometrics"
    CRITICAL_INFRASTRUCTURE = "critical_infrastructure"
    EDUCATION = "education_vocational_training"
    EMPLOYMENT = "employment_workers_management"
    ESSENTIAL_SERVICES = "essential_private_public_services"
    LAW_ENFORCEMENT = "law_enforcement"
    MIGRATION_BORDER = "migration_asylum_border_control"
    JUSTICE_DEMOCRACY = "administration_of_justice_democratic_processes"


class AnnexIArea(str, enum.Enum):
    """Union harmonisation legislation product categories (Annex I, selection)."""

    MACHINERY = "machinery"
    TOYS = "toys"
    LIFTS = "lifts"
    MEDICAL_DEVICES = "medical_devices"
    IN_VITRO_DIAGNOSTICS = "in_vitro_diagnostics"
    RADIO_EQUIPMENT = "radio_equipment"
    CIVIL_AVIATION = "civil_aviation"
    MOTOR_VEHICLES = "motor_vehicles"
    MARINE_EQUIPMENT = "marine_equipment"
    RAIL_SYSTEMS = "rail_systems"
    PRESSURE_EQUIPMENT = "pressure_equipment"
    PERSONAL_PROTECTIVE_EQUIPMENT = "personal_protective_equipment"
    GAS_APPLIANCES = "gas_appliances"
    CABLEWAYS = "cableways"
    RECREATIONAL_CRAFT = "recreational_craft"
    AGRICULTURAL_VEHICLES = "agricultural_vehicles"


class AssessmentAnswers(BaseModel):
    """Questionnaire answers driving the classification decision tree.

    Field order mirrors the order in which the Act is applied.
    """

    # --- Article 5: prohibited practices -----------------------------------
    uses_subliminal_or_manipulative_techniques: bool = Field(
        False,
        description="Deploys subliminal, purposefully manipulative or deceptive "
        "techniques that materially distort behaviour causing significant harm "
        "(Art. 5(1)(a)).",
    )
    exploits_vulnerabilities: bool = Field(
        False,
        description="Exploits vulnerabilities due to age, disability or social/"
        "economic situation to distort behaviour causing significant harm "
        "(Art. 5(1)(b)).",
    )
    social_scoring: bool = Field(
        False,
        description="Evaluates/classifies persons based on social behaviour or "
        "personal characteristics leading to detrimental treatment in unrelated "
        "contexts (Art. 5(1)(c)).",
    )
    predictive_policing_profiling_only: bool = Field(
        False,
        description="Assesses the risk of a person committing a criminal offence "
        "based solely on profiling or personality traits (Art. 5(1)(d)).",
    )
    untargeted_facial_image_scraping: bool = Field(
        False,
        description="Creates or expands facial recognition databases through "
        "untargeted scraping of the internet or CCTV footage (Art. 5(1)(e)).",
    )
    emotion_recognition_workplace_or_education: bool = Field(
        False,
        description="Infers emotions of persons in the workplace or education "
        "institutions, outside medical/safety use (Art. 5(1)(f)).",
    )
    biometric_categorisation_sensitive_attributes: bool = Field(
        False,
        description="Biometric categorisation deducing race, political opinions, "
        "trade-union membership, religious beliefs, sex life or sexual "
        "orientation (Art. 5(1)(g)).",
    )
    realtime_remote_biometric_id_public_spaces: bool = Field(
        False,
        description="Real-time remote biometric identification in publicly "
        "accessible spaces for law-enforcement purposes (Art. 5(1)(h)).",
    )

    # --- Article 6(1) / Annex I: product-embedded high risk -----------------
    is_safety_component_of_regulated_product: bool = Field(
        False,
        description="The AI system is a product, or a safety component of a "
        "product, covered by Union harmonisation legislation in Annex I.",
    )
    annex_i_product_categories: list[AnnexIArea] = Field(
        default_factory=list,
        description="Which Annex I product categories apply.",
    )
    requires_third_party_conformity_assessment: bool = Field(
        False,
        description="The product must undergo third-party conformity assessment "
        "under the relevant Annex I legislation.",
    )

    # --- Article 6(2) / Annex III: stand-alone high risk ---------------------
    annex_iii_areas: list[AnnexIIIArea] = Field(
        default_factory=list,
        description="Annex III high-risk areas the system's intended purpose "
        "falls under.",
    )

    # --- Article 6(3): derogation from Annex III classification -------------
    performs_narrow_procedural_task: bool = Field(
        False, description="Intended to perform a narrow procedural task (Art. 6(3)(a))."
    )
    improves_result_of_prior_human_activity: bool = Field(
        False,
        description="Intended to improve the result of a previously completed "
        "human activity (Art. 6(3)(b)).",
    )
    detects_patterns_without_replacing_human_assessment: bool = Field(
        False,
        description="Detects decision-making patterns or deviations without "
        "replacing or influencing human assessment (Art. 6(3)(c)).",
    )
    performs_preparatory_task_only: bool = Field(
        False,
        description="Performs a preparatory task to an assessment relevant for "
        "Annex III use cases (Art. 6(3)(d)).",
    )
    performs_profiling_of_natural_persons: bool = Field(
        False,
        description="The system performs profiling of natural persons. Profiling "
        "always disqualifies the Art. 6(3) derogation.",
    )

    # --- Article 50: transparency-affected systems ---------------------------
    interacts_directly_with_natural_persons: bool = Field(
        False,
        description="Natural persons interact directly with the system, e.g. a "
        "chatbot (Art. 50(1)).",
    )
    generates_synthetic_content: bool = Field(
        False,
        description="Generates synthetic audio, image, video or text content "
        "(Art. 50(2)).",
    )
    uses_emotion_recognition: bool = Field(
        False,
        description="Operates an emotion recognition system outside prohibited "
        "contexts (Art. 50(3)).",
    )
    uses_biometric_categorisation: bool = Field(
        False,
        description="Operates a biometric categorisation system outside "
        "prohibited contexts (Art. 50(3)).",
    )
    generates_deepfakes: bool = Field(
        False,
        description="Generates or manipulates image, audio or video content "
        "constituting a deep fake (Art. 50(4)).",
    )


# Obligations attached to each tier, surfaced so downstream modules
# (documentation, transparency, monitoring) can plan work items.
HIGH_RISK_OBLIGATIONS: list[dict[str, str]] = [
    {"article": "Art. 9", "obligation": "Establish and maintain a risk management system"},
    {"article": "Art. 10", "obligation": "Data governance: training, validation and testing data quality"},
    {"article": "Art. 11", "obligation": "Draw up technical documentation (Annex IV)"},
    {"article": "Art. 12", "obligation": "Record-keeping: automatic logging over the system lifetime"},
    {"article": "Art. 13", "obligation": "Transparency and provision of information to deployers"},
    {"article": "Art. 14", "obligation": "Design for effective human oversight"},
    {"article": "Art. 15", "obligation": "Accuracy, robustness and cybersecurity"},
    {"article": "Art. 17", "obligation": "Quality management system"},
    {"article": "Art. 43", "obligation": "Conformity assessment before placing on the market"},
    {"article": "Art. 49", "obligation": "Registration in the EU database"},
]

LIMITED_RISK_OBLIGATIONS: list[dict[str, str]] = [
    {"article": "Art. 50", "obligation": "Inform natural persons that they are interacting with an AI system / that content is AI-generated"},
]

MINIMAL_RISK_OBLIGATIONS: list[dict[str, str]] = [
    {"article": "Art. 95", "obligation": "Voluntary codes of conduct (recommended)"},
    {"article": "Art. 4", "obligation": "AI literacy of staff dealing with the system"},
]


@dataclass
class Classification:
    tier: RiskTier
    matched_provisions: list[str] = field(default_factory=list)
    rationale: list[str] = field(default_factory=list)
    obligations: list[dict[str, str]] = field(default_factory=list)
    transparency_duties: list[str] = field(default_factory=list)

    def as_dict(self) -> dict:
        return {
            "tier": self.tier.value,
            "matched_provisions": self.matched_provisions,
            "rationale": self.rationale,
            "obligations": self.obligations,
            "transparency_duties": self.transparency_duties,
        }


_PROHIBITED_CHECKS: list[tuple[str, str, str]] = [
    ("uses_subliminal_or_manipulative_techniques", "Art. 5(1)(a)", "subliminal or manipulative techniques causing significant harm"),
    ("exploits_vulnerabilities", "Art. 5(1)(b)", "exploitation of vulnerabilities of persons"),
    ("social_scoring", "Art. 5(1)(c)", "social scoring with detrimental treatment"),
    ("predictive_policing_profiling_only", "Art. 5(1)(d)", "criminal risk assessment based solely on profiling"),
    ("untargeted_facial_image_scraping", "Art. 5(1)(e)", "untargeted scraping for facial recognition databases"),
    ("emotion_recognition_workplace_or_education", "Art. 5(1)(f)", "emotion recognition in workplace or education"),
    ("biometric_categorisation_sensitive_attributes", "Art. 5(1)(g)", "biometric categorisation of sensitive attributes"),
    ("realtime_remote_biometric_id_public_spaces", "Art. 5(1)(h)", "real-time remote biometric identification in public spaces"),
]

_TRANSPARENCY_CHECKS: list[tuple[str, str, str]] = [
    ("interacts_directly_with_natural_persons", "Art. 50(1)", "Inform persons that they are interacting with an AI system"),
    ("generates_synthetic_content", "Art. 50(2)", "Mark synthetic content as artificially generated (machine-readable)"),
    ("uses_emotion_recognition", "Art. 50(3)", "Inform persons exposed to emotion recognition"),
    ("uses_biometric_categorisation", "Art. 50(3)", "Inform persons exposed to biometric categorisation"),
    ("generates_deepfakes", "Art. 50(4)", "Disclose that deep fake content has been artificially generated or manipulated"),
]


def classify(answers: AssessmentAnswers) -> Classification:
    """Run the full decision tree and return an auditable classification."""

    # Step 1 — Article 5 prohibited practices trump everything.
    prohibited = [
        (provision, label)
        for attr, provision, label in _PROHIBITED_CHECKS
        if getattr(answers, attr)
    ]
    if prohibited:
        return Classification(
            tier=RiskTier.UNACCEPTABLE,
            matched_provisions=[p for p, _ in prohibited],
            rationale=[f"Prohibited practice: {label} ({p})" for p, label in prohibited],
            obligations=[
                {
                    "article": p,
                    "obligation": "This practice is prohibited. The system may not "
                    "be placed on the market, put into service or used in the EU.",
                }
                for p, _ in prohibited
            ],
        )

    transparency_duties = [
        f"{provision}: {duty}"
        for attr, provision, duty in _TRANSPARENCY_CHECKS
        if getattr(answers, attr)
    ]

    # Step 2 — Article 6(1): safety component of an Annex I product.
    if answers.is_safety_component_of_regulated_product and (
        answers.requires_third_party_conformity_assessment
    ):
        categories = ", ".join(c.value for c in answers.annex_i_product_categories) or "unspecified"
        return Classification(
            tier=RiskTier.HIGH,
            matched_provisions=["Art. 6(1)", "Annex I"],
            rationale=[
                "The system is a product or safety component of a product covered "
                f"by Annex I Union harmonisation legislation ({categories}) and is "
                "subject to third-party conformity assessment.",
            ],
            obligations=list(HIGH_RISK_OBLIGATIONS),
            transparency_duties=transparency_duties,
        )

    # Step 3 — Article 6(2): Annex III stand-alone high-risk areas.
    if answers.annex_iii_areas:
        derogation_grounds = [
            label
            for attr, label in [
                ("performs_narrow_procedural_task", "narrow procedural task (Art. 6(3)(a))"),
                ("improves_result_of_prior_human_activity", "improves result of prior human activity (Art. 6(3)(b))"),
                ("detects_patterns_without_replacing_human_assessment", "pattern detection without replacing human assessment (Art. 6(3)(c))"),
                ("performs_preparatory_task_only", "preparatory task only (Art. 6(3)(d))"),
            ]
            if getattr(answers, attr)
        ]
        areas = ", ".join(a.value for a in answers.annex_iii_areas)

        if derogation_grounds and not answers.performs_profiling_of_natural_persons:
            # Derogation applies: not high-risk, but documentation of that
            # conclusion must be registered (Art. 6(4), Art. 49(2)).
            tier = (
                RiskTier.LIMITED if transparency_duties else RiskTier.MINIMAL
            )
            return Classification(
                tier=tier,
                matched_provisions=["Art. 6(3)", "Annex III"]
                + (["Art. 50"] if transparency_duties else []),
                rationale=[
                    f"Intended purpose falls under Annex III area(s): {areas}, but the "
                    "Art. 6(3) derogation applies: "
                    + "; ".join(derogation_grounds)
                    + ". The derogation assessment must be documented and the system "
                    "registered under Art. 49(2).",
                ],
                obligations=(
                    list(LIMITED_RISK_OBLIGATIONS) if transparency_duties else list(MINIMAL_RISK_OBLIGATIONS)
                ),
                transparency_duties=transparency_duties,
            )

        rationale = [f"Intended purpose falls under Annex III high-risk area(s): {areas}."]
        if answers.performs_profiling_of_natural_persons and derogation_grounds:
            rationale.append(
                "The Art. 6(3) derogation is unavailable because the system "
                "performs profiling of natural persons."
            )
        return Classification(
            tier=RiskTier.HIGH,
            matched_provisions=["Art. 6(2)", "Annex III"],
            rationale=rationale,
            obligations=list(HIGH_RISK_OBLIGATIONS),
            transparency_duties=transparency_duties,
        )

    # Step 4 — Article 50 transparency-only systems.
    if transparency_duties:
        return Classification(
            tier=RiskTier.LIMITED,
            matched_provisions=["Art. 50"],
            rationale=["The system triggers transparency obligations under Art. 50."],
            obligations=list(LIMITED_RISK_OBLIGATIONS),
            transparency_duties=transparency_duties,
        )

    # Step 5 — minimal risk.
    return Classification(
        tier=RiskTier.MINIMAL,
        matched_provisions=[],
        rationale=[
            "The system matches no prohibited practice, no Annex I/III high-risk "
            "category and no Art. 50 transparency case."
        ],
        obligations=list(MINIMAL_RISK_OBLIGATIONS),
    )
