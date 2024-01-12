import prisma from '$lib/prisma';
import { DraftEventSchema } from '$lib/types/event';
import { DateTime } from 'luxon';
export async function POST(request) {
	try {
		const body = await request.request.json();
		body.meta.date = DateTime.fromISO(body.meta.date).toJSDate();
		if (!body.R_0) body.R_0 = [];
		if (!body.R_1) body.R_1 = [];
		if (!body.R_2) body.R_2 = [];
		// console.log(body.id, body.meta.date);
		// return new Response();
		let data = DraftEventSchema.parse(body);
		const possibleFind = await prisma.event.findFirst({ where: { id: data.id } });
		if (possibleFind !== null) {
			// return new Response();
			await prisma.event.update({ data: data, where: { id_: possibleFind.id_ } });
		} else {
			await prisma.event.create({ data: data });
		}
		return new Response();
	} catch (error) {
		console.log(error);
		return new Response();
	}
}
