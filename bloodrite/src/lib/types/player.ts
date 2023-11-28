import type { TagData } from '$lib/types/server-specific';

export type EloRatingRecord = { event: string; newrating: number; date: string };

export type Player = {
	id: string;
	tag_data: TagData;
};
