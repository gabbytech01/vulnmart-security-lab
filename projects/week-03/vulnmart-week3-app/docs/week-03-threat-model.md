# VulnMart Week 3 Threat Model

## Scope and assumptions

This model covers the public catalogue and the current application foundation. VulnMart is a fictional local-lab system. It must not receive real customer information, real payment details, or traffic from systems that the learner is not authorized to test.

## Assets

| Asset | Security property | Current exposure |
|---|---|---|
| Product catalogue | Integrity and availability | Public read-only listing |
| User records | Confidentiality and integrity | Modelled, not used by the public catalogue |
| Orders and order items | Confidentiality, integrity, and authorization | Modelled, no order workflow exposed yet |
| Session identity | Confidentiality and integrity | Managed by the scaffold's OAuth/session boundary |
| Database connection | Confidentiality and availability | Server-side environment only |
| Security evidence | Integrity and traceability | Tests and documentation stored in the repository |

## Actors

The expected actors are an anonymous visitor, an authenticated learner, an administrator in a future phase, and an unauthorized attacker used only as a controlled test persona. External identity and infrastructure providers are dependencies, not trusted application users.

## Entry points and abuse cases

| Entry point | Initial concern | Week 3 control or decision | Future test |
|---|---|---|---|
| Public `catalogue.list` procedure | Excessive data exposure | Return only active catalogue fields | Contract and response-shape test |
| Public `health` procedure | Information disclosure | Return service state and lab environment only | Assert no secrets or connection details |
| Browser request inputs | Client-side tampering | Treat browser as untrusted; server remains authoritative | Input-validation tests when mutations arrive |
| OAuth callback/session | Session confusion or fixation | Keep framework-managed session handling | Authentication and session tests |
| Database connection | Credential exposure | Use server-side environment variables and ORM access | Secret and least-privilege review |
| Future order procedures | IDOR/BOLA and business-logic abuse | No public order mutation exists yet | Authorization matrix and negative tests |

## Initial security requirements

The baseline must keep secrets out of client bundles and responses. Public procedures must return the minimum data required by the public page. Database access must remain server-side. Future procedures must distinguish authentication from authorization, validate identifiers and quantities, and verify ownership or administrative privilege before reading or changing orders. Error responses should be useful to the learner but should not disclose credentials, SQL, stack traces, or infrastructure internals.

## Risk treatment

Week 3 intentionally chooses **defer and document** for checkout, payment, account management, search, filtering, and order APIs. Deferral keeps the baseline small and makes later vulnerabilities attributable to one feature at a time. The lab will label intentionally vulnerable changes, keep them isolated from real systems, and pair each exercise with a fixed implementation and regression test.

## Verification checklist

- [x] Public catalogue returns fictional active products.
- [x] Health procedure reports only safe service metadata.
- [x] No real customer reviews, ratings, testimonials, payments, or customer data are present.
- [x] Vitest covers catalogue and health behavior.
- [x] TypeScript compilation passes.
- [ ] Add authorization matrix when account and order procedures are introduced.
- [ ] Add threat scenarios and remediation tests for each future lab vulnerability.
