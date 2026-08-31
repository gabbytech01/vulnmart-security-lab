import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("public VulnMart foundation", () => {
  it("reports local-lab health", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const health = await caller.health();

    expect(health.status).toBe("ok");
    expect(health.service).toBe("vulnmart");
    expect(health.environment).toBe("local-lab");
    expect(new Date(health.timestamp).toString()).not.toBe("Invalid Date");
  });

  it("returns a public catalogue with fictional products", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const catalogue = await caller.catalogue.list();

    expect(catalogue.length).toBeGreaterThanOrEqual(3);
    expect(catalogue.every(product => product.status === "active")).toBe(true);
    expect(catalogue.every(product => product.priceCents > 0)).toBe(true);
    expect(catalogue.map(product => product.slug)).toContain("security-notebook");
  });
});
