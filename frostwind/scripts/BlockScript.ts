import { Card, Player, globalEvents } from "@tabletop-playground/api";
import type { Card as ScryfallCard } from "./Scryfall";

globalEvents.onChatMessage.add((sender, message) => {
	if (message.match(/^Frostwind\sfuzzy\s/g)) {
		// Fuzzy search Scryfall for cards.
		const [query] = message.match(/(?<=^Frostwind\sfuzzy\s).+/) ?? [null];
		if (query !== null) {
			fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURI(query)}`)
				.then((r) => {
					return r.json();
				})
				.then((v) => {
					// @ts-expect-error
					world.createObjectFromTemplate("31E5DB224CB620FF0B35E79BB7BB8D02", sender.getCursorPosition()).setSavedData(v.id, "sf_id");
				});
		}
	}
	if (message.match(/^Frostwind\shttps:\/\/www\.moxfield\.com\/decks\/.+/)) {
		const [mox_id] = message.match(/(?<=^Frostwind\shttps:\/\/www\.moxfield\.com\/decks\/).+/) ?? [null];
		if (mox_id !== null) {
			makeMoxfieldDeck(mox_id, sender);
		}
	}
	if (message.match(/^Frostwind\shttps:\/\/cubecobra\.com\/cube\/(list|overview)\/.+/)) {
		const [cc_id] = message.match(/(?<=^Frostwind\shttps:\/\/cubecobra\.com\/cube\/overview\/).+/) ?? message.match(/(?<=^Frostwind\shttps:\/\/cubecobra\.com\/cube\/list\/).+/) ?? [null];
		console.log(cc_id);
		if (cc_id !== null) {
			makeCubeCobraCube(cc_id, sender);
		}
	}
});

function makeMoxfieldDeck(deck_id: string, player: Player) {
	fetch(`https://api2.moxfield.com/v2/decks/all/${deck_id}`)
		.then((r) => r.json())
		.then(async (v: MoxfieldResponse) => {
			const position = player.getCursorPosition();
			const main_deck: { scryfall_id: string }[] = [];
			const side_deck: typeof main_deck = [];
			const comm_deck: typeof main_deck = [];
			// const comp_deck = []
			// const attr_deck = []
			// const sign_deck = []
			// const stic_deck = []

			const { mainboard, sideboard, commanders, companions, attractions, signatureSpells, stickers } = v;

			Object.entries(mainboard).forEach(([k, v]) => (v.printingData === undefined ? main_deck.push(...Array(v.quantity).fill({ scryfall_id: v.card.scryfall_id })) : main_deck.push(...Array(v.printingData[0].quantity).fill({ scryfall_id: v.printingData[0].card.scryfall_id }), ...Array(v.printingData[1].quantity).fill({ scryfall_id: v.printingData[1].card.scryfall_id }))));
			Object.entries(sideboard).forEach(([k, v]) => (v.printingData === undefined ? side_deck.push(...Array(v.quantity).fill({ scryfall_id: v.card.scryfall_id })) : side_deck.push(...Array(v.printingData[0].quantity).fill({ scryfall_id: v.printingData[0].card.scryfall_id }), ...Array(v.printingData[1].quantity).fill({ scryfall_id: v.printingData[1].card.scryfall_id }))));
			Object.entries(commanders).forEach(([k, v]) => (v.printingData === undefined ? comm_deck.push(...Array(v.quantity).fill({ scryfall_id: v.card.scryfall_id })) : comm_deck.push(...Array(v.printingData[0].quantity).fill({ scryfall_id: v.printingData[0].card.scryfall_id }), ...Array(v.printingData[1].quantity).fill({ scryfall_id: v.printingData[1].card.scryfall_id }))));
			async function create_stack(deck: typeof main_deck, transform: [number, number, number]) {
				let main_stack: Card | undefined = undefined;
				let main_ls: string[] = [];
				for (let index = 0; index < deck.length; index++) {
					const element = deck[index];
					if (index % 75 === 0 || index === deck.length - 1) {
						if (main_stack === undefined) {
							const c = await fetch(`https://api.scryfall.com/cards/${element.scryfall_id}`);
							const j = await c.json();
							// @ts-expect-error
							const q: Card = world.createObjectFromTemplate("31E5DB224CB620FF0B35E79BB7BB8D02", position.add(transform));
							if (["normal", "adventure", "flip", "split", "meld", "leveler", "class", "saga", "planar", "vanguard", "token", "augment", "host"].includes(j.layout)) {
								q.setTextureOverrideURL(j.image_uris.normal.concat(`&scryfall_id=${element.scryfall_id}&front_face=true`));
							} else {
								q.setTextureOverrideURL(j.card_faces[0].image_uris.normal.concat(`&scryfall_id=${element.scryfall_id}&front_face=true`));
							}
							main_stack = q;
						} else {
							const collection = main_ls.map((c) => ({ id: c }));
							collection.push({ id: element.scryfall_id });
							const response = await fetch(`https://api.scryfall.com/cards/collection`, { method: "POST", body: JSON.stringify({ identifiers: collection }) });
							const j: { data: ScryfallCard[] } = await response.json();
							j.data.forEach((c) => {
								// @ts-expect-error
								const q = world.createObjectFromTemplate("31E5DB224CB620FF0B35E79BB7BB8D02", position.add(transform));
								if (["normal", "adventure", "flip", "split", "meld", "leveler", "class", "saga", "planar", "vanguard", "token", "augment", "host"].includes(c.layout)) {
									q.setTextureOverrideURL(c.image_uris.normal.concat(`&scryfall_id=${c.id}&front_face=true`));
								} else {
									// @ts-expect-error
									q.setTextureOverrideURL(c.card_faces[0].image_uris.normal.concat(`&scryfall_id=${c.id}&front_face=true`));
								}
								main_stack!.addCards(q);
							});
							main_ls = [];
						}
					} else {
						main_ls.push(element.scryfall_id);
					}
				}
			}

			await create_stack(main_deck, [0, 0, 1]);
			await create_stack(side_deck, [0, 8, 1]);
			await create_stack(comm_deck, [0, 16, 1]);
		});
}

function makeCubeCobraCube(cube_id: string, player: Player) {
	fetch(`https://cubecobra.com/cube/api/cubeJSON/${cube_id}`)
		.then((r) => r.json())
		.then(async (v: CubeCobraResponse) => {
			const position = player.getCursorPosition();
			const main_board: { scryfall_id: string }[] = [];
			const maybe_board: typeof main_board = [];

			const {
				cards: { mainboard, maybeboard },
			} = v;

			Object.entries(mainboard).forEach(([k, v]) => main_board.push({ scryfall_id: v.details.scryfall_id }));
			Object.entries(maybeboard).forEach(([k, v]) => maybe_board.push({ scryfall_id: v.details.scryfall_id }));

			async function create_stack(deck: typeof main_board, transform: [number, number, number]) {
				let main_stack: Card | undefined = undefined;
				let main_ls = [];
				for (let index = 0; index < deck.length; index++) {
					const element = deck[index];
					if (index % 75 === 0 || index === deck.length - 1) {
						if (main_stack === undefined) {
							const c = await fetch(`https://api.scryfall.com/cards/${element.scryfall_id}`);
							const j: ScryfallCard = await c.json();
							// @ts-expect-error
							const q: Card = world.createObjectFromTemplate("31E5DB224CB620FF0B35E79BB7BB8D02", position.add(transform));
							if (["normal", "adventure", "flip", "split", "meld", "leveler", "class", "saga", "planar", "vanguard", "token", "augment", "host"].includes(j.layout)) {
								q.setTextureOverrideURL(j.image_uris.normal.concat(`&scryfall_id=${element.scryfall_id}&front_face=true`));
							} else {
								// @ts-expect-error
								q.setTextureOverrideURL(j.card_faces[0].image_uris.normal.concat(`&scryfall_id=${element.scryfall_id}&front_face=true`));
							}
							main_stack = q;
						} else {
							const collection = main_ls.map((c) => ({ id: c }));
							collection.push({ id: element.scryfall_id });
							const response = await fetch(`https://api.scryfall.com/cards/collection`, { method: "POST", body: JSON.stringify({ identifiers: collection }) });
							const j: { data: ScryfallCard[] } = await response.json();
							j.data.forEach((c) => {
								// @ts-expect-error
								const q = world.createObjectFromTemplate("31E5DB224CB620FF0B35E79BB7BB8D02", position.add(transform));
								if (["normal", "adventure", "flip", "split", "meld", "leveler", "class", "saga", "planar", "vanguard", "token", "augment", "host"].includes(c.layout)) {
									q.setTextureOverrideURL(c.image_uris.normal.concat(`&scryfall_id=${c.id}&front_face=true`));
								} else {
									// @ts-expect-error
									q.setTextureOverrideURL(c.card_faces[0].image_uris.normal.concat(`&scryfall_id=${c.id}&front_face=true`));
								}
								main_stack!.addCards(q);
							});
							main_ls = [];
						}
					} else {
						main_ls.push(element.scryfall_id);
					}
				}
			}

			await create_stack(main_board, [0, 0, 1]);
			await create_stack(maybe_board, [0, 8, 1]);
		});
}
