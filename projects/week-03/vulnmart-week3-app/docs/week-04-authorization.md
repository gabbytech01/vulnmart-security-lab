# VulnMart Week 4 Authorization Foundation

## Objective

Week 4 adds the first protected application surface: an account summary and a user-scoped order-history view. The implementation is secure by default and intentionally does not accept a client-selected `userId` for these reads.

## Authorization matrix

| Actor | Public catalogue | Account summary | Own order history | Another user's order history | Admin-only operations |
|---|---:|---:|---:|---:|---:|
| Anonymous visitor | Allow | Deny | Deny | Deny | Deny |
| Authenticated user | Allow | Allow | Allow | Deny | Deny |
| Administrator | Allow | Allow | Allow for own identity | Deny unless an explicit audited admin procedure is added | Defer |

Authentication answers **who is making the request**. Authorization answers **whether that identity may access the requested resource**. The Week 4 procedures use the authenticated session in `ctx.user`, then pass `ctx.user.id` directly to the order query helper. The client cannot provide a substitute identifier through the procedure input.

## Protected data flow

1. The browser navigates to `/account`.
2. The existing session hook checks the authenticated identity through `auth.me`.
3. If no session exists, the page offers the existing OAuth login action and does not enable protected queries.
4. If a session exists, the page calls `account.me` and `account.orders` through tRPC.
5. `account.orders` reads `ctx.user.id` on the server and invokes `getOrdersByUserId(ctx.user.id)`.
6. The database query filters by the server-derived user ID and sorts the result by creation time.
7. The UI renders an empty state when the signed-in user has no orders; it does not expose another user's records.

## Week 4 threat-model update

| Threat-model element | Week 4 treatment |
|---|---|
| Actors | Anonymous visitor, authenticated learner, administrator, and unauthorized test persona |
| Assets | Account identity, email address, role, order IDs, order status, totals, and timestamps |
| Entry points | `/account`, `account.me`, `account.orders`, and the existing OAuth/session callback |
| Trust boundaries | Browser to tRPC server, tRPC server to database, and application to OAuth infrastructure |
| Primary abuse cases | Anonymous protected-resource access, client-selected user identity, cross-user order disclosure, and privilege confusion |
| Required controls | Protected procedures, server-derived identity, database ownership predicate, minimum response fields, and negative regression tests |

The browser is an untrusted actor and the database is a separate persistence boundary. The account page may display data, but it cannot establish ownership. The server session context is the source of identity for these procedures. No administrator-wide order search exists, so an administrator does not receive an implicit bypass.

## Security properties

The account router uses `protectedProcedure`, so missing sessions fail with `UNAUTHORIZED`. The order-history procedure has no user ID input, which reduces the attack surface for direct object-reference mistakes. The database helper also makes the ownership condition explicit at the persistence boundary. The page labels the boundary for learners and keeps checkout, order creation, payment data, and administrative order search out of scope.

## Negative-test strategy

The test suite verifies that anonymous callers cannot invoke either protected procedure, that an authenticated caller receives their own account summary, and that two authenticated users receive different mocked order sets based only on their respective server-side session IDs. The test also verifies the exact IDs passed to the query helper. This is a regression guard: if a future developer adds a client-controlled ID, the procedure contract and test should be changed deliberately and reviewed as a security decision.

The authenticated `/account` state was visually verified in the managed preview, including the account identity panel, identity-status badge, empty order-history state, sign-out control, and the server-derived ownership boundary note. The public homepage was also rechecked to confirm that the account route is discoverable for an authenticated session without removing public catalogue access.

## Future controlled exercise

A later lab branch may introduce an intentionally vulnerable order lookup that accepts an arbitrary order ID or user ID. That exercise must record the vulnerable request, evidence, impact, fixed implementation, and regression test. The secure Week 4 baseline should remain available as the comparison point.
