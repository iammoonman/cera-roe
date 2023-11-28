/**
 * This file is specifically for defining things specific to Limited Perspective.
 * Our own tag names, event titles, etc.
 * Other types and such should be generic.
 */

import type { EloRatingRecord } from "./player";

/**
 * DPS = Draft Progression Series
 *
 * PTM = Prime Time
 *
 * ANTI = Unaffiliated
 */
export type Tag = 'dps' | 'ptm' | 'anti';

export type TagData = {
	dps?: EloRatingRecord[];
}

export const Tags = ['ptm', 'anti', 'dps'] as const;

export const ServerStartDate = 'May 19 2018';

type Role = { color: string; label: string; value: number };

const roles = new Map<string, Role>([
	['446847430302892032', { color: '#e91e63', label: 'Admin', value: 0 }],
	['640076640428359681', { color: '#9b59b6', label: 'Rat Catcher', value: 1 }],
	['640077115102068738', { color: '#c27c0e', label: 'Pack Rat', value: 2 }],
	['782052670026285066', { color: '#3498db', label: 'The Rat Signal', value: 3 }],
	['1077278556431851552', { color: '#a84300', label: 'Script Nibbler', value: 4 }],
	['1127261848887111681', { color: '', label: 'Server Booster', value: 6 }],
	['', { color: 'invalid', label: '', value: 5 }]
]);

/**
 *
 * @param role_ids List of role ids from Discord.
 * @returns An object containing a label and color hex for the highest valued role.
 */
export const getHighestRank = (role_ids: string[]): Role => {
	let highest = '';
	let val = 5;
	for (let rank of role_ids) {
		const r = roles.get(rank);
		if (r === undefined) {
			return { color: '', label: '', value: 9 };
		}
		if (r.value < val) {
			val = r.value;
			highest = rank;
		}
	}
	return roles.get(highest)!;
};

export const isAdmin = (role_ids: string[]): boolean => {
	return role_ids.includes('446847430302892032');
};
