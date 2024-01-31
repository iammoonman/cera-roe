/**
 * This file is specifically for defining things specific to Limited Perspective.
 * Our own tag names, event titles, etc.
 * Other types and such should be generic.
 */

import { z } from 'zod';
import type { EloRatingRecord } from './player';

export type TagData = {
	dps?: EloRatingRecord[];
};

export const Tags = ['ptm', 'anti', 'dps'] as const;

export const ZodTags = z.union([z.literal('dps'), z.literal('ptm'), z.literal('anti')]);

/**
 * DPS = Draft Progression Series
 *
 * PTM = Prime Time
 *
 * ANTI = Unaffiliated
 */
export type Tag = z.infer<typeof ZodTags>;

export const ServerStartDate = 'May 19 2018';

type Role = { color: string; label: string; value: number };

const roles = new Map<string, Role>([
	['446847430302892032', { color: '#e91e63', label: 'Admin', value: 5 }],
	['640076640428359681', { color: '#9b59b6', label: 'Rat Catcher', value: 4 }],
	['782052670026285066', { color: '#3498db', label: 'The Rat Signal', value: 1 }],
	['1077278556431851552', { color: '#a84300', label: 'Script Nibbler', value: 0 }],
	['1127261848887111681', { color: '', label: 'Server Booster', value: 0 }],
	['1184712941484908545', { color: '#d05484', label: 'Western Rat', value: 2 }],
	['1184713291646390302', { color: '#875635', label: 'Eastern Rat', value: 2 }],
	['1184713471212912681', { color: '#97f5e5', label: 'Aussie Rat', value: 2 }],
	['1184715938667438180', { color: '', label: 'Pick Up Game Rat', value: 0 }],
	['', { color: 'invalid', label: '', value: 0 }]
]);

/**
 *
 * @param role_ids List of role ids from Discord.
 * @returns An object containing a label and color hex for the highest valued role.
 */
export const getHighestRank = (role_ids: string[]): Role => {
	let highest = '';
	let val = 0;
	for (let rank of role_ids) {
		const r = roles.get(rank);
		if (r === undefined) {
			continue;
		}
		if (r.value > val) {
			val = r.value;
			highest = rank;
		}
	}
	return roles.get(highest)!;
};

export const isAdmin = (role_ids: string[]): boolean => {
	return role_ids.includes('446847430302892032');
};
