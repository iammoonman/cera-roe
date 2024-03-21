import { z } from 'zod';
import { ZodTags, type Tag } from './server-specific';

export type DraftEvent_original = {
	id: string;
	meta: {
		date: string;
		title: string;
		description?: string;
		tag?: Tag;
		/** The Discord ID of the host. */
		host?: string;
		/** The CubeCobra ID of the cube played. */
		cube_id?: string;
		/** The set played. Use the first set of the block for a block draft. Chaos drafts don't fill this out. */
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

const Test = {
	id: '',
	meta: {
		date: '2024-01-12T14:40:22Z',
		title: '',
		cube_id: 'fnf',
		tag: 'ptm'
	},
	R_0: [{ players: ['x', 'y'], games: [0, 1, 1] }, { players: ['z'] }]
};

export const DraftEventSchema = z.object({
	id: z.string(),
	meta: z.object({
		date: z.coerce.date(),
		title: z.string(),
		description: z.optional(z.string()),
		tag: z.optional(ZodTags),
		host: z.optional(z.string()),
		cube_id: z.optional(z.string()),
		set_code: z.optional(z.string().max(3))
	}),
	R_0: z.optional(
		z
			.array(
				z.object({
					players: z.array(z.string()).max(2),
					games: z.optional(z.array(z.number()).max(3)),
					scores: z.optional(z.array(z.number()).max(2))
				})
			)
			.max(5)
	),
	R_1: z.optional(
		z
			.array(
				z.object({
					players: z.array(z.string()).max(2),
					games: z.optional(z.array(z.number()).max(3)),
					scores: z.optional(z.array(z.number()).max(2))
				})
			)
			.max(5)
	),
	R_2: z.optional(
		z
			.array(
				z.object({
					players: z.array(z.string()).max(2),
					games: z.optional(z.array(z.number()).max(3)),
					scores: z.optional(z.array(z.number()).max(2))
				})
			)
			.max(5)
	)
});

DraftEventSchema.parse(Test);

export type DraftEvent = z.infer<typeof DraftEventSchema>;

export function getPlayersAndScores(draft: DraftEvent) {
	let players: Map<string, { id: string; gwp: number; mp: number; omp?: number; ogp?: number; mwp?: number }> = new Map();
	let scoresMap = new Map<string, Map<string, { gw: number; gl: number; gt: number; r: 'WIN' | 'LOSE' | 'TIE' | 'BYE'; rnd: number }>>();
	for (const prop in draft) {
		if (prop.startsWith('R_')) {
			for (const match of draft[prop as 'R_0' | 'R_1' | 'R_2'] ?? []) {
				if (match.players.length === 1) {
					scoresMap.get(match.players[0])?.set(`BYE_${prop}`, { gt: 0, gl: 0, gw: 0, r: 'BYE', rnd: parseInt(prop.at(-1)!) });
				} else {
					const p0_wins = match.games?.filter((v) => v === 0).length ?? match.scores?.at(0) ?? 0;
					const p1_wins = match.games?.filter((v) => v === 1).length ?? match.scores?.at(1) ?? 0;
					const ties = match.games?.filter((v) => v === -1).length ?? 0;
					const p0_result = p0_wins === 2 || (p0_wins === 1 && p1_wins === 0) ? 'WIN' : p0_wins === p1_wins ? 'TIE' : 'LOSE';
					const p1_result = p1_wins === 2 || (p1_wins === 1 && p0_wins === 0) ? 'WIN' : p1_wins === p0_wins ? 'TIE' : 'LOSE';
					if (scoresMap.get(match.players[0])?.get(match.players[1])) {
						scoresMap.get(match.players[0])?.set(`REMATCH_${match.players[1]}`, {
							gw: p0_wins,
							gt: ties,
							gl: p1_wins,
							r: p0_result,
							rnd: parseInt(prop.at(-1)!)
						});
					} else if (
						scoresMap.get(match.players[0])?.set(match.players[1], {
							gw: p0_wins,
							gt: ties,
							gl: p1_wins,
							r: p0_result,
							rnd: parseInt(prop.at(-1)!)
						}) === undefined
					)
						scoresMap.set(
							match.players[0],
							new Map([[match.players[1], { gw: p0_wins, gl: p1_wins, gt: ties, r: p0_result, rnd: parseInt(prop.at(-1)!) }]])
						);
					if (scoresMap.get(match.players[1])?.get(match.players[0])) {
						scoresMap.get(match.players[1])?.set(`REMATCH_${match.players[0]}`, {
							gw: p1_wins,
							gt: ties,
							gl: p0_wins,
							r: p1_result,
							rnd: parseInt(prop.at(-1)!)
						});
					} else if (
						scoresMap.get(match.players[1])?.set(match.players[0], {
							gw: p1_wins,
							gt: ties,
							gl: p0_wins,
							r: p1_result,
							rnd: parseInt(prop.at(-1)!)
						}) === undefined
					)
						scoresMap.set(
							match.players[1],
							new Map([[match.players[0], { gw: p1_wins, gl: p0_wins, gt: ties, r: p1_result, rnd: parseInt(prop.at(-1)!) }]])
						);
				}
			}
		}
	}
	for (const [id, subMap] of scoresMap) {
		let total_mp = 0;
		let total_gp = 0;
		let total_games = 0;
		let won_matches = 0;
		for (const [subId, subScore] of subMap) {
			if (subId.startsWith('BYE_')) {
				total_mp = total_mp + 3;
			} else {
				total_mp = total_mp + (subScore.r === 'WIN' || subScore.r === 'BYE' ? 3 : subScore.r === 'LOSE' ? 0 : 1);
				total_gp = total_gp + subScore.gw;
				total_games = total_games + subScore.gt + subScore.gw + subScore.gl;
				won_matches = won_matches + (subScore.r === 'WIN' ? 1 : 0);
			}
		}
		players.set(id, { id, gwp: total_gp / total_games, mp: total_mp, mwp: won_matches / subMap.size });
	}
	for (const [id, subMap] of scoresMap) {
		let thisPlayer = players.get(id)!;
		let gwpSum = 0;
		let mpSum = 0;
		for (const [subId] of subMap) {
			gwpSum = gwpSum + (players.get(subId)?.gwp ?? 0);
			mpSum = mpSum + (players.get(subId)?.mwp ?? 0);
		}
		players.set(id, { ...thisPlayer, omp: mpSum / subMap.size, ogp: gwpSum / subMap.size });
	}
	return { players, scoresMap };
}
