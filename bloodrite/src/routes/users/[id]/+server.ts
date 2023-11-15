import { GuildMember, REST, Routes, User } from 'discord.js';
import { GUILD, TOKEN } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import type { Member } from '$lib/stores/PlayerStore';
export async function POST(requestEvent: RequestEvent) {
	const { userlist } = await requestEvent.request.json();
	const rest = new REST({ version: '10' }).setToken(TOKEN);
	const returnList = [];
	for (const user of userlist) {
		// Check the redis cache for the user
		returnList.push(await rest.get(Routes.user(user)));
	}
	return json(returnList, { headers: { 'cache-control': 'max-age=86400' } });
}
export async function GET(requestEvent: RequestEvent) {
	if (requestEvent.params['id'] === '') return json({}, { headers: { 'cache-control': 'max-age=86400' } });
	// Check the redis cache for the user
	const rest = new REST({ version: '10' }).setToken(TOKEN);
	let memb_json: Member | null = null;
	try {
		// throw 'Member Route Sucks';
		const member: any = await rest.get(Routes.guildMember(GUILD, requestEvent.params['id']));
		memb_json = {
			accent_color: member.displayHexColor,
			avatar: null,
			id: member.id,
			// @ts-ignore
			name: member.nick ?? member.user.global_name ?? member.user.username,
			joined_at: member.joinedAt?.toISOString() ?? undefined,
			roles: member.roles
		};
	} catch {}
	const user: any = await rest.get(Routes.user(requestEvent.params['id']));
	memb_json = {
		// @ts-ignore
		name: user.global_name ?? user.username,
		accent_color: `#${user.accent_color}` ?? '#000000',
		roles: [],
		...(memb_json ?? {}),
		avatar: user.avatar,
		id: user.id,
	};
	// console.log(memb_json);
	return json(memb_json, { headers: { 'cache-control': 'max-age=86400' } });
}
