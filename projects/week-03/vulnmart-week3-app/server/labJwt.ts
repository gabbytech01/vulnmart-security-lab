export type LabJwtClaims = {
  sub: number;
  role: "user" | "admin";
  iat: number;
  exp?: number;
};

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode(value: string): unknown {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

// INTENTIONALLY VULNERABLE: the lab token uses alg=none and has no signature.
export function issueUnsignedLabToken(claims: LabJwtClaims): string {
  const header = encode({ alg: "none", typ: "JWT" });
  const payload = encode(claims);
  return `${header}.${payload}.`;
}

// INTENTIONALLY VULNERABLE: decodes claims without verifying a signature,
// issuer, audience, expiry, or token integrity.
export function decodeLabToken(token: string): LabJwtClaims {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) {
    throw new Error("Invalid lab JWT format");
  }
  return decode(parts[1]) as LabJwtClaims;
}
