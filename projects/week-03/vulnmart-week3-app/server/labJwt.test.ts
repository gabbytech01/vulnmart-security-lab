import { describe, expect, it } from "vitest";
import { decodeLabToken, issueUnsignedLabToken } from "./labJwt";

describe("public JWT training lab", () => {
  it("demonstrates that the unsigned token identity can be changed", () => {
    const original = issueUnsignedLabToken({
      sub: 42,
      role: "user",
      iat: Date.now(),
    });

    const [header, , signature] = original.split(".");
    const forgedPayload = Buffer.from(
      JSON.stringify({ sub: 77, role: "admin", iat: Date.now() }),
    ).toString("base64url");
    const forged = `${header}.${forgedPayload}.${signature}`;
    const claims = decodeLabToken(forged);

    expect(signature).toBe("");
    expect(claims.sub).toBe(77);
    expect(claims.role).toBe("admin");
  });
});
