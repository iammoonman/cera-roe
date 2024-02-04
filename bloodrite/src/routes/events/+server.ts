import prisma from '$lib/prisma';
import { DraftEventSchema } from '$lib/types/event';
export async function POST({ request }) {
	const body = await request.json();
	if (!body.R_0) body.R_0 = [];
	if (!body.R_1) body.R_1 = [];
	if (!body.R_2) body.R_2 = [];
	let data = DraftEventSchema.parse(body);
	const possibleFind = await prisma.event.findFirst({ where: { id: data.id } });
	if (possibleFind !== null) {
		// return new Response();
		await prisma.event.update({ data: data, where: { id_: possibleFind.id_ } });
	} else {
		await prisma.event.create({ data: data });
	}
	return new Response('Event received.');
}
