import { readable, readonly } from 'svelte/store';
import type { Player } from '$lib/types/player';

class PlayerStore {
	private players = new Map<string, Player>([['', { id: '', tag_data: { dps: [] } }]]);
	private playerPromises = new Map<string, Promise<any>>();
	async get(playerId: string): Promise<Player | undefined> {
		if (playerId.length === 0) return undefined;
		if (this.players.get(playerId) === undefined) {
			if (this.playerPromises.get(playerId) === undefined)
				this.playerPromises.set(
					playerId,
					fetch(`/players/${playerId}`)
						.then((v) => v.json())
						.then((v) => {
							if (Object.hasOwn(v, 'id')) this.players.set(playerId, v);
						})
				);
			await this.playerPromises.get(playerId);
		}
		return this.players.get(playerId) ?? { id: playerId, tag_data: {} };
	}
}

const player_access_internal = readable(new PlayerStore());

export const player_access = readonly(player_access_internal);
