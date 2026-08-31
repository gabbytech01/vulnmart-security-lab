import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const { getOrdersByUserId } = vi.hoisted(() => ({
  getOrdersByUserId: vi.fn(),
}));

vi.mock("./db", () => ({
  getActiveProducts: vi.fn().mockResolvedValue([]),
  getOrdersByUserId,
}));

type User = NonNullable<TrpcContext["user"]>;

function createContext(user: User): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const attacker: User = {
  id: 42,
  openId: "lab-attacker",
  email: "attacker@vulnmart.test",
  name: "Lab Attacker",
  loginMethod: "lab",
  role: "user",
  createdAt: new Date( ),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("IDOR/BOLA lab demonstration", () => {
  it("shows that the vulnerable route accepts another user's ID", async () => {
    getOrdersByUserId.mockResolvedValueOnce([
      {
        id: 9002,
        userId: 77,
        status: "paid",
        totalCents: 2500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const caller = appRouter.createCaller(createContext(attacker));
    const result = await caller.account.ordersByUserIdLab({ userId: 77 });

    expect(result[0]?.userId).toBe(77);
    expect(getOrdersByUserId).toHaveBeenCalledWith(77);
  });
});

