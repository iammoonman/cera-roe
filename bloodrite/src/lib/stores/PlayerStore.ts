import { readable, readonly } from 'svelte/store';

export type Member = {
	id: string;
	username: string;
	avatar: string | null;
	discriminator: string;
	public_flags: number;
	premium_type: number;
	flags: number;
	banner: null;
	accent_color: null;
	global_name: string;
	avatar_decoration_data: null;
	banner_color: null;
};

class PlayerStore {
	private players = new Map<string, Member>();
	private playerPromises = new Map<string, Promise<any>>();
	async get(playerId: string) {
		if (this.players.get(playerId) === undefined) {
			if (this.playerPromises.get(playerId) === undefined)
				this.playerPromises.set(
					playerId,
					fetch(`/users/${playerId}`)
						.then((v) => v.json())
						.then((v) => {
							if (Object.hasOwn(v, 'id')) this.players.set(playerId, v);
						})
				);
			await this.playerPromises.get(playerId);
		}
		return this.players.get(playerId);
	}
}

const player_access_internal = readable(new PlayerStore());

export const player_access = readonly(player_access_internal);
