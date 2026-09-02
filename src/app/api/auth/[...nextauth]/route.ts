import { handlers } from "@/lib/auth";

/**
 * Auth.js's own endpoints: sign-in, sign-out, session, CSRF.
 *
 * It lives under /api/auth and NOT under /api/admin, which matters for the
 * proxy: /api/admin/* is closed to anyone without a session, and putting the
 * sign-in endpoint behind that rule would mean needing a session in order to
 * get one.
 */
export const { GET, POST } = handlers;
