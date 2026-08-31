import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getActiveProducts } from "./db";

const fallbackProducts = [
  {
    id: 1,
    slug: "security-notebook",
    name: "Security Notebook",
    description: "A practical field notebook for threat observations, test cases, and remediation notes.",
    category: "Learning tools",
    priceCents: 1250,
    stockQuantity: 24,
    status: "active" as const,
  },
  {
    id: 2,
    slug: "linux-lab-guide",
    name: "Linux Lab Guide",
    description: "A fictional guided workbook for building repeatable local security-lab habits.",
    category: "Training",
    priceCents: 1800,
    stockQuantity: 12,
    status: "active" as const,
  },
  {
    id: 3,
    slug: "http-practice-kit",
    name: "HTTP Practice Kit",
    description: "A fictional practice collection for understanding requests, responses, headers, and APIs.",
    category: "Web security",
    priceCents: 2500,
    stockQuantity: 8,
    status: "active" as const,
  },
];

export const appRouter = router({
  system: systemRouter,
  health: publicProcedure.query(() => ({
    status: "ok" as const,
    service: "vulnmart",
    environment: "local-lab",
    timestamp: new Date().toISOString(),
  })),
  catalogue: router({
    list: publicProcedure.query(async () => {
      const storedProducts = await getActiveProducts();
      return storedProducts.length > 0 ? storedProducts : fallbackProducts;
    }),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
