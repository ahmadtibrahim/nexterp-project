import { User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
// import { DrizzleAdapter } from "@auth/drizzle-adapter"
// import { db } from "@/lib/db";
// import { Adapter } from "next-auth/adapters";
// import { userInHrm, AccountInHrm, SessionInHrm, VerificationTokenInHrm, role_modules_mapInHrm, modulesInHrm } from "@/drizzle/schema";
// import { and, eq } from "drizzle-orm";
import { createId } from "@/drizzle/schema";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { getServerSession } from "next-auth"


export const authOptions: NextAuthOptions = {
  // adapter: DrizzleAdapter(db,  {
  //   //@ts-expect-error As our users table structure different
  //   usersTable: userInHrm,accountsTable: AccountInHrm,sessionsTable: SessionInHrm, verificationTokensTable: VerificationTokenInHrm,
  // }) as Adapter,
  providers: [
    process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD && process.env.EMAIL_FROM ?
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
          }
        },
        from: process.env.EMAIL_FROM
      }) : undefined,
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ?
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        profile(profile) {
          return {
            id: profile.id.toString(),
            email: profile.email,
            f_name: profile.name.split(" ")[0] ?? profile.login.split(" ")[0],
            l_name: profile.name.split(" ")[1] ?? profile.login.split(" ")[1],
            role_id: null,
            profileComplete: false,
            tenant_id: createId()
          };
        }
      }) : undefined,
    CredentialsProvider({
      id: "guest",
      credentials: {},
      async authorize(credentials, req) {
        const user: User = {
          id: 1,
          email: "guest@example.com",
          f_name: "Guest",
          l_name: "User",
          role_id: null,
          profileComplete: false,
          tenant_id: "preview"
        };
        return user;
      }
    })
  ].filter(Boolean),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number;
        token.f_name = user.f_name;
        token.l_name = user.l_name;
        token.role_id = user.role_id;
        token.tenant_id = user.tenant_id;
        token.profileComplete = user.profileComplete;
        token.resticted_modules = user.resticted_modules;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as number;
      session.user.f_name = token.f_name as string;
      session.user.l_name = token.l_name as string;
      session.user.role_id = token.role_id as number;
      session.user.profileComplete = token.profileComplete as boolean;
      session.user.tenant_id = token.tenant_id as string;
      session.user.resticted_modules = token.resticted_modules;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}
