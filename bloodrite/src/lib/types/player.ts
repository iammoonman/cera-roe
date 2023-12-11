import type { Tag, TagData } from '$lib/types/server-specific';

export type EloRatingRecord = { event: string; newrating: number; date: string };

export type DisplayCard = { id: string; scryfall_id: string; description: string; title: string };

export type TrophyCard = { id: string };

export type PlayerStatistic = { value: number; id: string; date: string };

/**
 * Show the last updated date on the site.
 *
 * Use that request to check against nextUpdate and run the calculation.
 *
 * Could do all at once, but tag stats will probably calc more often or at a different rate.
 *
 * Calculate only for users that are currently displaying the stat? Or for all?
 */
export type StatisticMeta = { id: string; lastUpdated: string; nextUpdate: string; tag?: Tag };

export type Player = {
	id: string;
	tag_data: TagData;
	statistics?: PlayerStatistic[];
	/** Cares about order. Statistic IDs. */
	display?: string[];
};
