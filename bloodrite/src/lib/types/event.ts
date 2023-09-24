import type { Tag } from './server-specific';

type DraftEvent = {
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
	[k: number]: Array<Round>;
};

type Round =
	| {
			players: [string, string];
			games:
				| [number | null]
				| [number | null, number | null]
				| [number | null, number | null, number | null];
	  }
	| { players: [string]; games?: never };

const Test: DraftEvent = {
	id: '',
	meta: {
		date: '',
		title: '',
		cube_id: 'fnf',
	},
	0: [{ players: ['x', 'y'], games: [0, 1, 1] }, { players: ['z'] }]
};
