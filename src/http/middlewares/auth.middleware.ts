import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

export const verifyJwt = auth({
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  audience: process.env.AUDIENCE,
  tokenSigningAlg: "RS256"
});

// Check if token is valid
// check if token is revoked
// check scope

export const authorize = (...scopes: string[]) => [
  auth, // validate token
  requiredScopes(scopes)
];
