import { REST, Routes } from 'discord.js';
import { GUILD, TOKEN } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
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
	const rest = new REST({ version: '10' }).setToken(TOKEN);
	// Check the redis cache for the user
	const user = await rest.get(Routes.user(requestEvent.params['id']));
	return json(user, { headers: { 'cache-control': 'max-age=86400' } });
}
