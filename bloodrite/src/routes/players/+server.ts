import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';

export async function GET() {
    return json({});
	await prisma.event.findMany({
		where: {
			OR: [{ R_0: { some: { players: { has: '' } } } }, { R_1: { some: { players: { has: '' } } } }, { R_2: { some: { players: { has: '' } } } }]
		}
	});
	return json([]);
}
