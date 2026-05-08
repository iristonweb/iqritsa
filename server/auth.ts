import type { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AuthContext {
  userId: string;
}

const jwksUrl = process.env.SUPABASE_JWKS_URL;
const issuer = process.env.SUPABASE_ISSUER;
const audience = process.env.SUPABASE_AUDIENCE;
const jwks = jwksUrl ? createRemoteJWKSet(new URL(jwksUrl)) : null;

function isProd() {
  return process.env.NODE_ENV === "production";
}

function getToken(req: Request): string | null {
  const authHeader = req.header("authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);

  if (!jwks) {
    if (isProd()) {
      return res.status(500).json({ error: "SUPABASE_JWKS_URL is not configured" });
    }
    const devUserId = req.header("x-dev-user-id") || "dev-user";
    (req as Request & { auth?: AuthContext }).auth = { userId: devUserId };
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: issuer || undefined,
      audience: audience || undefined,
    });
    if (typeof payload.sub !== "string" || !payload.sub) {
      return res.status(401).json({ error: "Invalid token subject" });
    }
    (req as Request & { auth?: AuthContext }).auth = { userId: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
