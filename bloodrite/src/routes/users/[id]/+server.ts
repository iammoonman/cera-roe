import { GuildMember, REST, Routes, User } from 'discord.js';
import { GUILD, TOKEN } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import type { Member } from '$lib/stores/MemberStore';
import { DiscordClient } from '$lib/stores/DiscordStore';
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
	if (typeof requestEvent.params['id'] !== 'string') console.log(requestEvent.params);
	// Check the redis cache for the user
	let memb_json: Member | null = null;
	// return json({}, { headers: { 'cache-control': 'max-age=86400' } });
	try {
		const guild = await DiscordClient.guilds.fetch(GUILD);
		// @ts-ignore
		const member = await guild.members.fetch(requestEvent.params['id']);
		if (member === undefined) throw new Error('BIG PROBLEM');
		// throw 'Member Route Sucks';
		memb_json = {
			accent_color: member.displayHexColor,
			avatar: member.displayAvatarURL(),
			id: member.id,
			name: member.nickname ?? member.user.globalName ?? member.user.username,
			joined_at: member.joinedAt?.toISOString() ?? undefined,
			roles: member.roles.valueOf().map((v) => v.id)
		};
	} catch {
		const user: any = await DiscordClient.rest.get(Routes.user(requestEvent.params['id']));
		memb_json = {
			// @ts-ignore
			name: user.global_name ?? user.username,
			accent_color: `#${user.accent_color}` ?? '#000000',
			roles: [],
			avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg` : null,
			id: user.id
		};
	}
	// console.log(memb_json);
	return json(memb_json, { headers: { 'cache-control': 'max-age=86400' } });
}
