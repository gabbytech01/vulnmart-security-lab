import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getActiveProducts, getOrdersByUserId } from "./db";
import { decodeLabToken, issueUnsignedLabToken } from "./labJwt";
import { z } from "zod";

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
  account: router({
    me: protectedProcedure.query(({ ctx }) => ({
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
      memberSince: ctx.user.createdAt,
    })),
    orders: protectedProcedure.query(({ ctx }) => getOrdersByUserId(ctx.user.id)),
    // INTENTIONALLY VULNERABLE: lab-only BOLA/IDOR example.
    // The client can choose another user ID because ownership is not enforced.
    ordersByUserIdLab: protectedProcedure
      .input(z.object({ userId: z.number().int().positive() }))
      .query(({ input }) => getOrdersByUserId(input.userId)),
  }),

  labJwt: router({
    issue: publicProcedure
      .input(z.object({
        userId: z.number().int().positive(),
        role: z.enum(["user", "admin"]).default("user"),
      }))
      .mutation(({ input }) => ({
        token: issueUnsignedLabToken({
          sub: input.userId,
          role: input.role,
          iat: Date.now(),
        }),
        warning: "Training token only: unsigned and intentionally vulnerable.",
      })),
    orders: publicProcedure
      .input(z.object({ token: z.string().min(1) }))
      .query(({ input }) => {
        const claims = decodeLabToken(input.token);
        return getOrdersByUserId(claims.sub);
      }),
    // INTENTIONALLY VULNERABLE: role is trusted from the unsigned JWT.
    // Changing role from user to admin unlocks this fictional lab report.
    adminReport: publicProcedure
      .input(z.object({ token: z.string().min(1) }))
      .query(({ input }) => {
        const claims = decodeLabToken(input.token);
        if (claims.role !== "admin") {
          throw new Error("Lab report requires admin role");
        }
        return {
          report: "FICTIONAL LAB REPORT: VulnMart training metrics",
          viewerId: claims.sub,
          warning: "Training data only; never use real customer information.",
        };
      }),
  }),
});
