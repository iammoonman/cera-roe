import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';
export async function GET({ params: { id } }) {
	try {
        if (id === undefined) throw 'ID not defined.'
		const returnEvent = await prisma.event.findFirst({ where: { id } });
		return json(returnEvent);
	} catch (error) {
		console.log(error);
		return new Response();
	}
}
