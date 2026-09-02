import type { DefaultSession } from "next-auth";

/**
 * The three fields this site adds to a session.
 *
 * Declared here rather than cast at each call site, so that `session.user.role`
 * is a `"owner" | "editor"` everywhere and a typo in a permission check is a
 * build error rather than a silently false comparison.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "owner" | "editor";
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: "owner" | "editor";
    mustChangePassword: boolean;
  }
}

/**
 * The JWT interface is declared in `@auth/core/jwt`; `next-auth/jwt` only
 * re-exports it with `export *`, and an `export *` does not carry a module
 * augmentation back to where the interface was declared. Augmenting the
 * re-export compiles and does nothing, which is why this names the core module.
 */
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "owner" | "editor";
    mustChangePassword: boolean;
  }
}
