import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";

export async function GET({ params: { id } }) {
	// Should add an alternate source from the static event-data directory for when other people are developing without my keys.
	try {
		// const returnPlayer = await prisma.players.find({
		// 	where: {
		// 		id: id
		// 	}
		// });
		return json([]);
	} catch (error) {
		return json([]);
	}
}
