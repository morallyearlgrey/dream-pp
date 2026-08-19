import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";

type DiscordIdentity = {
  discordId?: string;
  discordUsername?: string;
  displayName?: string;
};

type AdminSessionUser = {
  discordId?: string;
  discordUsername?: string;
  isAdmin?: boolean;
  name?: string | null;
};

function getAllowedAdminIdentity() {
  return {
    discordId: process.env.ADMIN_DISCORD_ID?.trim() ?? "",
  };
}

function readStringField(source: unknown, field: string) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const value = (source as Record<string, unknown>)[field];

  return typeof value === "string" ? value : undefined;
}

function getDiscordIdentity(profile: unknown, user: unknown): DiscordIdentity {
  return {
    discordId: readStringField(profile, "id") ?? readStringField(user, "id"),
    discordUsername:
      readStringField(profile, "username") ??
      readStringField(profile, "global_name") ??
      readStringField(user, "name"),
    displayName: readStringField(profile, "global_name") ?? readStringField(user, "name"),
  };
}

function isAuthorizedDiscordIdentity(identity: DiscordIdentity) {
  const allowed = getAllowedAdminIdentity();

  return Boolean(allowed.discordId && identity.discordId === allowed.discordId);
}

function writeIdentityToToken(token: JWT, identity: DiscordIdentity) {
  token.discordId = identity.discordId;
  token.discordUsername = identity.discordUsername;
  token.isAdmin = isAuthorizedDiscordIdentity(identity);
}

export function isAuthorizedAdminSession(session: { user?: AdminSessionUser } | null) {
  return session?.user?.isAdmin === true;
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ profile, token, user }) {
      if (profile || user) {
        writeIdentityToToken(token, getDiscordIdentity(profile, user));
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const adminUser = session.user as AdminSessionUser;

        adminUser.discordId = typeof token.discordId === "string" ? token.discordId : undefined;
        adminUser.discordUsername =
          typeof token.discordUsername === "string" ? token.discordUsername : undefined;
        adminUser.isAdmin = token.isAdmin === true;
      }

      return session;
    },
    async signIn({ profile, user }) {
      return isAuthorizedDiscordIdentity(getDiscordIdentity(profile, user));
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
