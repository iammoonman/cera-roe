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
		date: z.string().datetime(),
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
