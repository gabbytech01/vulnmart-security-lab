# VulnMart Project Progress Report

**Project:** VulnMart Security Lab  
**Repository:** https://github.com/gabbytech01/vulnmart-security-lab  
**Focus:** Application Security and SecDevOps engineering through a controlled e-commerce application

## Progress Summary

VulnMart has progressed from a local HTTP demonstration into a functional, controlled e-commerce-style web application for practical security engineering and SecDevOps learning.

The application now includes a polished public product catalogue, a health/status endpoint, a relational data model, authenticated account access, and a secure user-scoped order-history foundation.

## Work Completed

| Area | Progress Achieved |
|---|---|
| Public catalogue | Added a responsive product catalogue with search, category filters, product detail briefs, loading states, error states, and empty states |
| Health endpoint | Added a public health/status procedure that exposes safe service metadata |
| Database foundation | Added tables for users, products, orders, and order items using Drizzle and MySQL-compatible schema definitions |
| Authentication | Connected the existing session and OAuth layer to protected account procedures |
| Authorization | Account and order-history procedures use the authenticated server-side user identity |
| Account experience | Added a protected `/account` page with login guidance, account details, order-history states, and error handling |
| Security documentation | Added architecture, threat-model, authorization, and local-lab setup documentation |
| Testing | Added automated tests for protected access, account access, and isolation between different users’ order histories |

## Security Engineering Approach

The project follows this engineering cycle:

> **Build → Break → Fix → Test → Automate → Document**

The current implementation establishes a secure baseline before intentionally vulnerable behavior is introduced. The order-history procedure does not accept a client-selected user ID. Instead, the server derives the user identity from the authenticated session before querying order data.

This prevents the browser from choosing which user’s order history should be returned. Automated tests verify that unauthenticated users are denied access and that different authenticated users receive isolated order-history results.

## Project Safety Boundary

VulnMart is fictional and intended only for authorized educational use. It does not contain real customer information, payment details, production data, customer reviews, or testimonials.

Checkout and order creation are intentionally not implemented yet. This allows future security exercises to be introduced in a controlled and measurable way.

## Verification

The application has been verified using automated tests and TypeScript checks. The public catalogue and protected account experience were also visually reviewed at desktop and mobile sizes.

The project changes have been committed and pushed to the existing GitHub repository alongside the earlier Linux, HTTP, and local client/server demonstrations.

## Next Objective

The next objective is to introduce a controlled IDOR/BOLA scenario using fictional local-lab data. The vulnerability will be documented, demonstrated safely, remediated, and covered with a regression test.

The secure implementation will remain preserved as the comparison baseline.

