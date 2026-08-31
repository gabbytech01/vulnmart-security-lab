# IDOR/BOLA Controlled Lab Exercise

## Scope

This exercise is performed only against the fictional VulnMart application and authorized local-lab code. No real customer, payment, or production data is used.

## Vulnerable route

The lab branch adds `ordersByUserIdLab` to the account router. The procedure accepts a `userId` supplied by the client and passes it directly to the order query helper.

## Security issue

The route verifies that the caller is authenticated but does not verify that the requested user ID belongs to the authenticated session. This is an object-level authorization weakness commonly described as IDOR or BOLA.

## Expected impact

An authenticated user could request another user’s order history by changing the `userId` value. The impact is unauthorized disclosure of order identifiers, statuses, totals, and timestamps.

## Evidence

The vulnerable data flow is:

```text
client-supplied userId → ordersByUserIdLab → getOrdersByUserId(userId)

The secure comparison procedure uses:
text
authenticated session → ctx.user.id → getOrdersByUserId(ctx.user.id)
Remediation plan
Remove the client-controlled lookup from the secure application path. Keep any vulnerable procedure isolated to the lab branch, then use the authenticated server-side identity for the fixed implementation and add a regression test proving that two users cannot access each other’s orders.
