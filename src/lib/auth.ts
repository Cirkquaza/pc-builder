import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;

const config: NextAuthConfig = {
  secret: authSecret,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
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
            return null;
          }

          // Lazy import to avoid issues during build
          const [{ prisma }, bcrypt] = await Promise.all([
            import("./prisma"),
            import("bcryptjs"),
          ]);

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) {
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
  pages: {
    signIn: authUrl ? `${authUrl}/auth/login` : "/auth/login",
    error: authUrl ? `${authUrl}/auth/login` : "/auth/login",
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

export const { handlers, auth, signIn, signOut } = NextAuth(config);
