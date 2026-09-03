# VulnMart Security Lab

VulnMart is an ongoing Application Security Engineer and SecDevOps project built around a deliberately vulnerable e-commerce-style web application.

The project is designed to provide a realistic environment for learning how web applications are built, tested, attacked, documented, and improved. It combines application development with practical security testing, threat modeling, secure-coding analysis, automated testing, and security documentation.

> **Build → Break → Test → Document → Expand**

## Project Goal

The goal of VulnMart is to create a public web-application security training target similar to intentionally vulnerable platforms such as VulnBank.

Learners can study common application-security weaknesses through fictional users, products, accounts, orders, and training responses. Every exercise is intended for authorized educational testing only.

VulnMart is not a real shopping platform and must not be connected to real customer data, real payment systems, production credentials, or internal business infrastructure.

## Progress So Far

VulnMart has developed from a basic local HTTP and client-server demonstration into a structured security laboratory.

The project currently includes:

- Linux security foundations and authentication-log triage.
- HTTP request anatomy and a local Python client-server demonstration.
- A React, TypeScript, Express, tRPC, Drizzle, and MySQL-compatible application foundation.
- A responsive public product catalogue with search, filtering, and product-detail views.
- A relational data model for users, products, orders, and order items.
- Authentication and protected account access.
- User-scoped order-history functionality.
- A deliberately vulnerable IDOR/BOLA order-access flow.
- A deliberately weak unsigned JWT training flow.
- JWT identity tampering behavior.
- JWT role confusion through an unverified role claim.
- A fictional administrative-report training procedure.
- Automated tests for the JWT and authorization scenarios.
- Architecture, threat-model, authorization, setup, vulnerability, and progress reports.
- A Git history that records the implementation and security-learning process.

## Current Vulnerability Modules

| Module | Training objective |
|---|---|
| IDOR/BOLA | Demonstrate the impact of missing object-level authorization |
| Unsigned JWT | Demonstrate why decoding a token is not the same as verifying it |
| JWT identity tampering | Demonstrate how unverified subject claims can influence data access |
| JWT role confusion | Demonstrate why administrative roles must not come from unverified claims |

The vulnerabilities in `main` are intentionally included for public security education. They are labeled in the source code and documented in the reports directory.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, and tRPC |
| Database access | Drizzle ORM |
| Database target | MySQL/TiDB-compatible relational database |
| Authentication foundation | OAuth and session-based application scaffold |
| Testing | Vitest and TypeScript checks |
| Version control | Git and GitHub |
