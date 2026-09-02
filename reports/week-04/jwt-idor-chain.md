# JWT-to-IDOR/BOLA Training Chain

## Scope

This exercise is part of the public VulnMart training application and uses fictional users, claims, products, and orders only. It is intended for authorized security education.

## What was added

The lab includes a separate training JWT flow. It issues an unsigned token using the `alg: none` header and decodes claims without verifying a cryptographic signature, issuer, audience, or expiry.

The training order procedure then trusts the token’s `sub` claim when selecting order data. This creates a layered authorization scenario rather than a single isolated flaw.

## Attack chain

```text
unsigned JWT
    → token claims can be changed
    → attacker-controlled sub claim
    → order lookup trusts sub
    → another user's fictional orders may be returned

Evidence
The automated test creates an original token for fictional user 42, changes the payload to user 77 with an admin role, and confirms that the lab decoder accepts the altered claims without a valid signature.
The existing IDOR/BOLA test separately demonstrates that a user-controlled identity can reach another user's order lookup.
Security lessons
Authentication and authorization are different controls. A token may exist and still be unsafe if its signature and claims are not validated. Even a correctly validated token does not replace object-level authorization; the server must still verify that the requested order belongs to the authenticated subject.
Remediation target
A fixed implementation must use a signed token with strict algorithm, issuer, audience, and expiry validation. It must derive the subject from verified claims and enforce ownership at the order query boundary.
