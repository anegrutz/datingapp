# Product roadmap

The MVP in this repository covers the four launch modules: AI inventory,
risk classification, Annex IV technical documentation, and Art. 50
transparency disclosures.

## V2 (6–12 months)

- **Data governance module (Art. 10)** — data lineage tracking, dataset
  registration, automated fairness metrics (demographic parity, disparate
  impact ratio, accuracy by group) and remediation recommendations.
- **Bias monitoring** — scheduled re-evaluation of fairness metrics with
  alerting on drift beyond thresholds.
- **Performance drift detection (Art. 15/72)** — accuracy degradation and
  anomaly detection wired to escalation workflows (Art. 14 human oversight).
- **Automated explanation generation** — counterfactual explanations for
  individual decisions (Art. 86 AI Act, Art. 22 GDPR).
- **Authentication & multi-tenancy** — organisation accounts, RBAC, audit
  log of who changed what.

## V3 (12+ months)

- Notified-body submission packaging (Art. 43 conformity assessment).
- EU database registration export (Art. 49 / Annex VIII).
- White-label / multi-tenant mode for consultancies and notified bodies.
- Integrations: MLflow / Git for automatic documentation refresh on model
  change; webhook connectors for major ML platforms.
- Remaining EU official languages for disclosures (6 shipped in MVP).

## Engineering notes

- The classifier rules live in `backend/app/services/risk_classifier.py` as a
  pure function. When the Commission issues new guidance or delegated acts
  amend Annex III, rules should become versioned data (a `rules_version`
  column already exists implicitly via the stored `result` JSON — assessments
  are immutable snapshots).
- SQLite is the dev default; production should run PostgreSQL
  (`DATABASE_URL`), EU-hosted for GDPR data-residency expectations.
- The widget is dependency-free vanilla JS so it can be embedded anywhere;
  next step is CSP-friendly hosting and an async iframe variant.
