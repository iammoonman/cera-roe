import { writable } from 'svelte/store';

type User = {
	id: string;
	avatar: string | null;
	global_name: string;
	accent_color: string | null;
};

type Authentication = {
	/** Set when the page mounts. Otherwise undefined. */
	user: User | undefined;
	/** The link to Discord's OAuth. */
	href: string;
	access_token: string;
};

export function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);
	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}
	return randomString;
}

export function makeHREF(access_token: string) {
	return `https://discord.com/api/oauth2/authorize?client_id=738493941334409278&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A5173&scope=identify+email&state=${encodeURIComponent(
		btoa(access_token)
	)}`;
}

export const Auth = writable<Authentication>({ href: '', user: undefined, access_token: '' });
