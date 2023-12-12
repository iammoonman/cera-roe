import { kv } from '@vercel/kv';
import { REST, Routes } from 'discord.js';
import { TOKEN } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
export async function POST(requestEvent: RequestEvent) {
	const { userlist } = await requestEvent.request.json();
	const rest = new REST({ version: '10' }).setToken(TOKEN);
	const returnList = [];
	for (const user of userlist) {
		// Check the redis cache for the user
		let kv_user = await kv.get(user);
		if (!kv_user) {
			try {
				// @ts-expect-error
				const member: GuildMemberResponse = await rest.get(Routes.guildMember(user_id));
				if (member === undefined) throw new Error('BIG PROBLEM');
				kv_user = {
					accent_color: `#${member.user.accent_color ?? '000000'}`,
					avatar: member.avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.avatar}.jpg` : null,
					id: member.user.id,
					name: member.nick ?? member.user.global_name ?? member.user.username,
					joined_at: member.joined_at,
					roles: member.roles
				};
			} catch {
				// @ts-expect-error
				const user_response: UserResponse = await rest.get(Routes.user(user_id));
				kv_user = {
					name: user_response.global_name ?? user_response.username,
					accent_color: `#${user_response.accent_color}` ?? '#000000',
					roles: [],
					avatar: user_response.avatar ? `https://cdn.discordapp.com/avatars/${user_response.id}/${user_response.avatar}.jpg` : null,
					id: user_response.id
				};
			}
			kv.set(user, kv_user, { ex: 604800 + Math.random() * 604800 });
		}
		returnList.push(kv_user);
	}
	return json(returnList, { headers: { 'cache-control': 'max-age=86400' } });
}
export async function GET(requestEvent: RequestEvent) {
	if (requestEvent.params['id'] === '') return json({}, { headers: { 'cache-control': 'max-age=86400' } });
	const user_id = requestEvent.params['id'];
	if (typeof user_id !== 'string' || user_id === undefined) {
		console.log('Someone tried to get user without an id: ', requestEvent.params);
		return json({});
	}
	let kv_user = await kv.get(user_id);
	if (!kv_user) {
		// Check the redis cache for the user
		const rest = new REST({ version: '10' }).setToken(TOKEN);
		try {
			// @ts-expect-error
			const member: GuildMemberResponse = await rest.get(Routes.guildMember(user_id));
			if (member === undefined) throw new Error('BIG PROBLEM');
			kv_user = {
				accent_color: `#${member.user.accent_color ?? '000000'}`,
				avatar: member.avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.avatar}.jpg` : null,
				id: member.user.id,
				name: member.nick ?? member.user.global_name ?? member.user.username,
				joined_at: member.joined_at,
				roles: member.roles
			};
		} catch {
			// @ts-expect-error
			const user: UserResponse = await rest.get(Routes.user(user_id));
			kv_user = {
				name: user.global_name ?? user.username,
				accent_color: `#${user.accent_color}` ?? '#000000',
				roles: [],
				avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg` : null,
				id: user.id
			};
		}
		kv.set(user_id, kv_user, { ex: 604800 + Math.random() * 604800 });
	}
	return json(kv_user, { headers: { 'cache-control': 'max-age=86400' } });
}
