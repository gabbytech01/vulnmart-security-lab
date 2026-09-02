# JWT Role-Confusion Training Module

## Scope

This module is part of the public VulnMart security-training application. It uses fictional identities and fictional training responses only.

## Vulnerability

The lab JWT uses `alg: none` and does not verify a cryptographic signature. The application also trusts the decoded `role` claim when deciding whether a fictional administrative report may be returned.

## Demonstration

A token created with a normal user identity can be replaced with a token whose claims contain a different fictional subject and `role: admin`. Because the lab decoder does not validate the signature or trusted issuer, the altered role is accepted.

## Impact in the lab

The role-confusion flaw can expose a fictional administrative report and can be combined with the lab order lookup to demonstrate how weak authentication and broken object-level authorization amplify each other.

## Secure lesson

A secure implementation must validate the token signature and approved algorithm, issuer, audience, expiry, and subject. Administrative access must also be determined by server-side authorization data rather than an unverified client-controlled claim.

## Public-lab boundary

The module must never use production secrets, real customer data, real payment systems, or connections to internal services. It exists only to teach JWT validation and authorization failure patterns in an authorized environment.
