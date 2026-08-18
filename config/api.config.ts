/**
 * API Configuration
 * Dynamically resolves backend endpoint from environment variables without hardcoded URLs.
 */
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "";
