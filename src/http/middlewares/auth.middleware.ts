import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

// Check if token is valid
// check if token is revoked
// check scope

export const authorize = (...scopes: string[]) => [
  auth, // validate token
  requiredScopes(scopes)
];
