import type { Tag } from './server-specific';

export type DraftEvent = {
	id: string;
	meta?: {
		date: string;
		title: string;
		description?: string;
		tag?: Tag;
		host?: string;
		cube_id?: string;
		set_code?: string;
	};
	[k: `R_${number}`]: Array<Match>;
};

type Match =
	| {
			players: [string, string];
			games: [number | -1] | [number | -1, number | -1] | [number | -1, number | -1, number | -1];
			scores?: never;
	  }
	| { players: [string]; games?: never; scores?: never }
	| { players: [string, string]; games?: never; scores: [number, number] };

const Test: DraftEvent = {
	id: '',
	meta: {
		date: '',
		title: '',
		cube_id: 'fnf'
	},
	'R_0': [{ players: ['x', 'y'], games: [0, 1, 1] }, { players: ['z'] }]
};
