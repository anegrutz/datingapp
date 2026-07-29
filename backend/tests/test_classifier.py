"""Unit tests for the risk classification engine."""

from app.services.risk_classifier import (
    AnnexIArea,
    AnnexIIIArea,
    AssessmentAnswers,
    RiskTier,
    classify,
)


def test_default_answers_are_minimal_risk():
    result = classify(AssessmentAnswers())
    assert result.tier == RiskTier.MINIMAL
    assert result.matched_provisions == []
    assert any("Art. 4" in o["article"] for o in result.obligations)


def test_prohibited_practice_social_scoring():
    result = classify(AssessmentAnswers(social_scoring=True))
    assert result.tier == RiskTier.UNACCEPTABLE
    assert "Art. 5(1)(c)" in result.matched_provisions


def test_prohibited_trumps_high_risk():
    result = classify(
        AssessmentAnswers(
            realtime_remote_biometric_id_public_spaces=True,
            annex_iii_areas=[AnnexIIIArea.LAW_ENFORCEMENT],
        )
    )
    assert result.tier == RiskTier.UNACCEPTABLE
    assert "Art. 5(1)(h)" in result.matched_provisions


def test_annex_i_safety_component_is_high_risk():
    result = classify(
        AssessmentAnswers(
            is_safety_component_of_regulated_product=True,
            annex_i_product_categories=[AnnexIArea.MEDICAL_DEVICES],
            requires_third_party_conformity_assessment=True,
        )
    )
    assert result.tier == RiskTier.HIGH
    assert "Art. 6(1)" in result.matched_provisions
    assert any(o["article"] == "Art. 11" for o in result.obligations)


def test_annex_i_without_third_party_assessment_not_high_risk():
    result = classify(
        AssessmentAnswers(
            is_safety_component_of_regulated_product=True,
            annex_i_product_categories=[AnnexIArea.TOYS],
            requires_third_party_conformity_assessment=False,
        )
    )
    assert result.tier == RiskTier.MINIMAL


def test_annex_iii_credit_scoring_is_high_risk():
    result = classify(
        AssessmentAnswers(annex_iii_areas=[AnnexIIIArea.ESSENTIAL_SERVICES])
    )
    assert result.tier == RiskTier.HIGH
    assert "Art. 6(2)" in result.matched_provisions
    articles = {o["article"] for o in result.obligations}
    assert {"Art. 9", "Art. 10", "Art. 14", "Art. 43", "Art. 49"} <= articles


def test_article_6_3_derogation_downgrades_annex_iii():
    result = classify(
        AssessmentAnswers(
            annex_iii_areas=[AnnexIIIArea.EMPLOYMENT],
            performs_narrow_procedural_task=True,
        )
    )
    assert result.tier == RiskTier.MINIMAL
    assert "Art. 6(3)" in result.matched_provisions
    assert any("Art. 49(2)" in r for r in result.rationale)


def test_profiling_blocks_derogation():
    result = classify(
        AssessmentAnswers(
            annex_iii_areas=[AnnexIIIArea.EMPLOYMENT],
            performs_narrow_procedural_task=True,
            performs_profiling_of_natural_persons=True,
        )
    )
    assert result.tier == RiskTier.HIGH
    assert any("profiling" in r for r in result.rationale)


def test_derogation_with_transparency_duty_is_limited():
    result = classify(
        AssessmentAnswers(
            annex_iii_areas=[AnnexIIIArea.EDUCATION],
            performs_preparatory_task_only=True,
            interacts_directly_with_natural_persons=True,
        )
    )
    assert result.tier == RiskTier.LIMITED
    assert result.transparency_duties


def test_chatbot_is_limited_risk():
    result = classify(AssessmentAnswers(interacts_directly_with_natural_persons=True))
    assert result.tier == RiskTier.LIMITED
    assert "Art. 50" in result.matched_provisions
    assert len(result.transparency_duties) == 1


def test_high_risk_keeps_transparency_duties():
    result = classify(
        AssessmentAnswers(
            annex_iii_areas=[AnnexIIIArea.BIOMETRICS],
            generates_deepfakes=True,
        )
    )
    assert result.tier == RiskTier.HIGH
    assert any("Art. 50(4)" in d for d in result.transparency_duties)


def test_as_dict_shape():
    d = classify(AssessmentAnswers(generates_synthetic_content=True)).as_dict()
    assert d["tier"] == "limited"
    assert set(d) == {
        "tier",
        "matched_provisions",
        "rationale",
        "obligations",
        "transparency_duties",
    }
