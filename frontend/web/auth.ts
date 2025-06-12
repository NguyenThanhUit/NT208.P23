import NextAuth, { Profile } from "next-auth";
import { OIDCConfig } from "next-auth/providers";
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"

export const { handlers, signIn, auth } = NextAuth({

    session: {
        strategy: 'jwt'
    },
    providers: [
        DuendeIDS6Provider({
            id: 'id-server',
            clientId: "nextApp",
            clientSecret: "secret",
            issuer: process.env.ID_URL,
            authorization: {
                params: {
                    scope: 'openid profile email address orderApp custom.claims',
                },
                url: process.env.ID_URL + '/connect/authorize'
            },
            token: {
                url: `${process.env.ID_URL_INTERNAL}/connect/token`
            },
            userinfo: {
                url: `${process.env.ID_URL_INTERNAL}/connect/token`
            }

        } as OIDCConfig<Omit<Profile, 'username'>>),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl
        },
        async authorized({ auth }) {
            return !!auth
        },
        async jwt({ token, profile, account }) {
            if (account && account.access_token) {
                token.accessToken = account.access_token;
            }

            if (profile) {
                token.username = profile.username;
                token.email = profile.email;
                token.address = profile.address?.formatted ?? undefined;
                token.id = String(profile.Id || profile.id || profile.sub);
                token.createdAt = profile.createdAt;
                token.name = profile.name;
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.username = token.username;
                session.user.id = token.id;
                session.user.address = token.address;
                session.user.createdAt = token.createdAt;
                session.user.name = token.name;
                session.accessToken = token.accessToken;
            }
            return session;
        }

    }


});

