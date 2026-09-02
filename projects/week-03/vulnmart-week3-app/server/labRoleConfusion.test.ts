import { describe, expect, it } from "vitest";
import { decodeLabToken, issueUnsignedLabToken } from "./labJwt";

describe("JWT role-confusion training lab", () => {
  it("accepts a fictional forged admin role because the token is unsigned", () => {
    const forgedToken = issueUnsignedLabToken({
      sub: 77,
      role: "admin",
      iat: Date.now(),
    });

    const claims = decodeLabToken(forgedToken);

    expect(claims.sub).toBe(77);
    expect(claims.role).toBe("admin");
  });
});
