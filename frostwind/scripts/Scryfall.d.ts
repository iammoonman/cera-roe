/**
 * Yoinked from https://github.com/ahmattox/mtg-scripting-toolkit
 * With some edits to make this less of a declaration and more of a utility.
 *
 * Types for request and response objects in Scryfall's API. These are not
 * complete or necessarily completely accurate, but have been added to as needed
 * based on the API documentation and example results.
 */

// Card Layouts: https://scryfall.com/docs/api/layouts
export type CardLayout = "normal" | "split" | "flip" | "transform" | "modal_dfc" | "meld" | "leveler" | "class" | "saga" | "adventure" | "battle" | "planar" | "scheme" | "vanguard" | "token" | "double_faced_token" | "emblem" | "augment" | "host" | "art_series" | "reversible_card";

// Set Types: https://scryfall.com/docs/api/sets#set-types
export type SetType = "core" | "expansion" | "masters" | "alchemy" | "masterpiece" | "arsenal" | "from_the_vault" | "spellbook" | "premium_deck" | "duel_deck" | "draft_innovation" | "treasure_chest" | "commander" | "planechase" | "archenemy" | "vanguard" | "funny" | "starter" | "box" | "promo" | "token" | "memorabilia" | "minigame";

export type Color = "W" | "U" | "B" | "R" | "G";

export type Rarity = "common" | "uncommon" | "rare" | "mythic" | "special" | "bonus";

export type Format = "standard" | "future" | "historic" | "gladiator" | "pioneer" | "explorer" | "modern" | "legacy" | "pauper" | "vintage" | "penny" | "commander" | "oathbreaker" | "brawl" | "historicbrawl" | "alchemy" | "paupercommander" | "duel" | "oldschool" | "premodern" | "predh";

// export const formats = Object.values(Format);

export type Legality = "legal" | "not_legal" | "restricted" | "banned";

export type FrameEffect = "legendary" | "miracle" | "nyxtouched" | "draft" | "devoid" | "tombstone" | "colorshifted" | "inverted" | "sunmoondfc" | "compasslanddfc" | "originpwdfc" | "mooneldrazidfc" | "waxingandwaningmoondfc" | "showcase" | "extendedart" | "companion" | "etched" | "SnOw" | "lesson" | "shatteredglass" | "convertdfc" | "fandfc" | "upsidedowndfc";

export type CardFaceName = "front" | "back";

export type ImageType = "small" | "normal" | "large" | "png" | "art_crop" | "border_crop";

// export const imageTypes = Object.values(ImageType);

/**
 * Attributes and combinations of attributes that can be used to uniquely
 * identify a card. Used in Scryfall's 'fetch collection' endpoint.
 */
export type CardID = string | { id: string } | { mtgo_id: string } | { multiverse_id: string } | { oracle_id: string } | { illustration_id: string } | { name: string } | { name: string; set: string } | { set: string; collector_number: string };

/**
 * Attributes to identify a card either by name and optional set or id. This
 * doesn't exactly represent a shape in Scryfall's API but is used for
 * requests for a single card.
 */
export type FetchCardID = { name: string; set?: string; id?: string } | { name?: string; set?: string; id: string };

export interface List {
	object: "list";
	not_found?: CardID[];
	total_cards?: number;
	has_more?: boolean;
	next_page?: string;
	data: Card[];
}

// Cards: https://scryfall.com/docs/api/cards
export interface Card {
	object: "card";
	id: string;
	oracle_id: string;
	multiverse_ids: number[];
	mtgo_id: number;
	mtgo_foil_id?: number;
	tcgplayer_id: number;
	cardmarket_id: number;
	name: string;
	flavor_name?: string;
	lang: string;
	released_at: string;
	uri: string;
	scryfall_uri: string;
	layout: CardLayout;
	highres_image: boolean;
	image_status: "missing" | "placeholder" | "lowres" | "highres_scan";
	image_uris: Record<ImageType, string>;
	mana_cost: string;
	cmc: number;
	type_line: string;
	oracle_text?: string;
	power?: string;
	toughness?: string;
	loyalty?: string;
	colors?: Color[];
	color_indicator?: Color[];
	color_identity: Color[];
	keywords: string[];
	all_parts?: {
		object: "related_card" | string;
		id: string;
		component: "combo_piece" | string;
		name: string;
		type_line: string;
		uri: string;
	}[];
	legalities: Record<Format, Legality>;
	games: string[];
	reserved: boolean;
	foil: boolean;
	nonfoil: boolean;
	finishes: ("nonfoil" | "foil" | string)[];
	oversized: boolean;
	promo: boolean;
	reprint: boolean;
	variation: boolean;
	set_id: string;
	set: string; // ~3 character set code
	set_name: string;
	set_type: SetType;
	set_uri: string;
	set_search_uri: string;
	scryfall_set_uri: string;
	rulings_uri: string;
	prints_search_uri: string;
	collector_number: string;
	digital: boolean;
	rarity: Rarity;
	flavor_text?: string;
	card_back_id: string;
	card_faces?: [CardFace, CardFace];
	artist: string;
	artist_ids: string[];
	illustration_id: string;
	border_color: "black" | "white" | "borderless" | "silver" | "gold";
	frame: "1993" | "1997" | "2003" | "2015" | "future";
	frame_effects?: FrameEffect[];
	security_stamp: "oval" | "triangle" | "acorn" | "arena" | "heart";
	full_art: boolean;
	textless: boolean;
	booster: boolean;
	story_spotlight: boolean;
	promo_types?: string[];
	edhrec_rank: number;
	penny_rank?: number;
	preview?: {
		source: string;
		source_uri: string;
		previewed_at: string;
	};
	prices: Record<string, string | null>;
	related_uris: Record<string, string>;
	purchase_uris: Record<string, string>;
}

export interface CardFace {
	object: "card_face";
	name: string;
	flavor_name?: string;
	mana_cost: string;
	type_line: string;
	oracle_text: string;
	colors: Color[];
	color_indicator?: Color[];
	power?: string;
	toughness?: string;
	defense?: string;
	loyalty?: string;
	artist: string;
	artist_id: string;
	illustration_id: string;
	image_uris: Record<string, string>;
	flavor_text?: string;
}

// Sets: https://scryfall.com/docs/api/sets
export interface Set {
	object: "set";
	id: string;
	code: string;
	mtgo_code?: string;
	arena_code?: string;
	tcgplayer_id?: number;
	name: string;
	uri: string;
	scryfall_uri: string;
	search_uri: string;
	released_at: string;
	set_type: SetType;
	card_count: number;
	parent_set_code?: string;
	digital: boolean;
	nonfoil_only: boolean;
	foil_only: boolean;
	icon_svg_uri: string;
}

export interface Error {
	object: "error";
	code: string;
	status: number;
	details: string;
}
