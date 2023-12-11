import { SvelteKitAuth } from '@auth/sveltekit';
import Discord from '@auth/core/providers/discord';
import { AUTH_SECRET, CLIENT, SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

// @ts-ignore
export const handle = SvelteKitAuth(async (event) => ({
	providers: [
		Discord({
			clientId: CLIENT,
			clientSecret: SECRET,
			authorization: 'https://discord.com/api/v10/oauth2/authorize?scope=identify+guilds',
			userinfo: 'https://discord.com/api/v10/oauth2/@me',
			profile: (profile) => {
				return { id: profile.user.id, email: profile.user.id, name: profile.user.global_name, image: `https://cdn.discordapp.com/avatars/${profile.user.id}/${profile.user.avatar}.png` };
			}
		})
	],
	secret: AUTH_SECRET,
	trustHost: true,
	callbacks: {
		async session({ session, token }: { session: any; token: any }) {
			// Destructure the parameters to get `session` and `token`
			if (session.user) {
				session.user.id = token.id;
				session.user.discriminator = token.discriminator;
			}
			return session;
		}
	}
})) satisfies Handle;
