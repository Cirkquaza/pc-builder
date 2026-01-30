import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import type { NextRequest } from "next/server";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;

const config = (request?: NextRequest): NextAuthConfig => {
  const host =
    request?.headers.get("x-forwarded-host") ?? request?.headers.get("host");
  const proto = request?.headers.get("x-forwarded-proto") ?? "https";
  const baseUrl = authUrl ?? (host ? `${proto}://${host}` : undefined);

  return {
    secret: authSecret,
    trustHost: true,
    debug: true,
    logger: {
      error(error: Error) {
        console.error("NextAuth error:", error);
      },
      warn(code: string) {
        console.warn("NextAuth warn:", code);
      },
      debug(code: string, metadata?: unknown) {
        console.debug("NextAuth debug:", code, metadata);
      },
    } as any,
    providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Auth: Missing credentials");
            return null;
          }

          console.log("Auth: Attempting login for:", credentials.email);

          // Lazy import to avoid issues during build
          const [{ prisma }, bcrypt] = await Promise.all([
            import("./prisma"),
            import("bcryptjs"),
          ]);

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log("Auth: User lookup result:", user ? `Found user: ${user.email}` : "User not found");

          if (!user || !user.password) {
            console.error("Auth: User not found or no password for:", credentials.email);
            return null;
          }

          // Require verified email
          if (!user.emailVerified) {
            console.error("Auth: Email not verified for:", user.email);
            return null;
          }

          const compare =
            bcrypt.compare ?? (bcrypt.default && bcrypt.default.compare);

          if (!compare) {
            console.error("Auth error: bcrypt compare not available");
            return null;
          }

          const passwordMatch = await compare(
            credentials.password as string,
            user.password
          );

          if (!passwordMatch) {
            console.error("Auth: Password mismatch for user:", user.email);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
    pages: baseUrl
      ? {
          signIn: `${baseUrl}/auth/login`,
          error: `${baseUrl}/auth/login`,
        }
      : {
          signIn: "/auth/login",
          error: "/auth/login",
        },
    callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
    session: {
      strategy: "jwt",
    },
  };
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
