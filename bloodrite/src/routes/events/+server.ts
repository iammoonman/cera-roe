import prisma from '$lib/prisma';
import { DateTime } from 'luxon';
import { EventCreateOneSchema } from '../../../prisma/generated/schemas/createOneEvent.schema';
export async function POST(request) {
	try {
		const body = await request.request.json();
		body.meta.date = DateTime.fromISO(body.meta.date).toJSDate();
		// console.log(body.id, body.meta.date);
		// return new Response();
		// const { data } = EventCreateOneSchema.parse(body);
		const possibleFind = await prisma.event.findFirst({ where: { id: body.id } });
		if (possibleFind !== null) {
			// return new Response();
			await prisma.event.update({ data: body, where: { id_: possibleFind.id_ } });
		} else {
			await prisma.event.create({ data: body });
		}
		return new Response();
	} catch (error) {
		console.log(error);
		return new Response();
	}
}
