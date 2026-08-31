# VulnMart Week 3 Setup and Verification

## Local development

From the project directory, install dependencies with `pnpm install`, then run `pnpm dev`. The managed development server exposes the React application and tRPC API through the project preview URL.

## Database baseline

The Drizzle schema is defined in `drizzle/schema.ts`, and the Week 3 migration is recorded in `drizzle/0001_plain_puppet_master.sql`. The migration creates the product, order, and order-item tables without destructive operations. Do not place database credentials in source files or commit `.env` files.

## Verification commands

Run `pnpm test` to execute the Vitest suite and `pnpm check` to run TypeScript compilation without emitting files. The current tests cover the public health response, active catalogue behavior, fictional product fallback, and existing logout behavior.

For manual verification, open the project preview and confirm that the homepage shows the public catalogue, the local-lab status badge, and the security boundary statement. The UI should remain usable at mobile and desktop widths.

## Safe lab rules

Use only fictional data and systems you own or are explicitly authorized to test. Do not connect the project to real payment providers, production databases, or customer records during vulnerability exercises. When a future exercise adds a weakness, record the affected endpoint, evidence, impact, remediation, and regression test in the repository before moving to the next exercise.
