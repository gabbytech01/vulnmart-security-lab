import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const { getOrdersByUserId } = vi.hoisted(() => ({ getOrdersByUserId: vi.fn() }));

vi.mock("./db", () => ({
  getActiveProducts: vi.fn().mockResolvedValue([]),
  getOrdersByUserId,
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user?: AuthenticatedUser): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const learner: AuthenticatedUser = {
  id: 42,
  openId: "week4-learner",
  email: "learner@example.com",
  name: "Week 4 Learner",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date("2026-08-01T00:00:00.000Z"),
  lastSignedIn: new Date("2026-08-31T00:00:00.000Z"),
};

describe("account authorization foundation", () => {
  it("denies account access without an authenticated session", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.account.me()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.account.orders()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns the authenticated user's account summary", async () => {
    const caller = appRouter.createCaller(createContext(learner));
    const account = await caller.account.me();

    expect(account).toMatchObject({
      id: 42,
      name: "Week 4 Learner",
      email: "learner@example.com",
      role: "user",
    });
  });

  it("isolates order history between two authenticated users", async () => {
    const orderA = { id: 1001, userId: 42, status: "paid", totalCents: 1250, createdAt: new Date(), updatedAt: new Date() };
    const orderB = { id: 1002, userId: 77, status: "fulfilled", totalCents: 1800, createdAt: new Date(), updatedAt: new Date() };
    getOrdersByUserId.mockImplementation(async (userId: number) => userId === 42 ? [orderA] : [orderB]);
    const callerA = appRouter.createCaller(createContext(learner));
    const callerB = appRouter.createCaller(createContext({ ...learner, id: 77, openId: "week4-other-learner" }));

    const ordersA = await callerA.account.orders();
    const ordersB = await callerB.account.orders();

    expect(ordersA).toEqual([orderA]);
    expect(ordersA).not.toContainEqual(orderB);
    expect(ordersB).toEqual([orderB]);
    expect(ordersB).not.toContainEqual(orderA);
    expect(getOrdersByUserId).toHaveBeenNthCalledWith(1, 42);
    expect(getOrdersByUserId).toHaveBeenNthCalledWith(2, 77);
  });
});
