import { readable, readonly } from 'svelte/store';

class PlayerStore {
	private players = new Map<
		string,
		{
			id: string;
			username: string;
			avatar: string;
			discriminator: string;
			public_flags: number;
			premium_type: number;
			flags: number;
			banner: null;
			accent_color: null;
			global_name: string;
			avatar_decoration_data: null;
			banner_color: null;
		}
	>();
	private playerPromises = new Map<string, Promise<any>>();
	async get(playerId: string) {
		if (this.players.get(playerId) === undefined) {
			if (this.playerPromises.get(playerId) === undefined)
				this.playerPromises.set(
					playerId,
					fetch(`/users/${playerId}`)
						.then((v) => v.json())
						.then((v) => this.players.set(playerId, v))
				);
			await this.playerPromises.get(playerId);
		}
		return this.players.get(playerId);
	}
}

const player_access_internal = readable(new PlayerStore());

export const player_access = readonly(player_access_internal);
