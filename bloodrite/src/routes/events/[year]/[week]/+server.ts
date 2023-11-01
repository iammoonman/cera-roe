import { json } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import prisma from '$lib/prisma';

export async function GET({ params: { year, week } }) {
	const startDate = DateTime.fromObject({ weekYear: parseInt(year), weekNumber: parseInt(week) }).startOf('week');
	const endDate = DateTime.fromObject({ weekYear: parseInt(year), weekNumber: parseInt(week) }).endOf('week');
	// Should add an alternate source from the static event-data directory for when other people are developing without my keys.
	const returnEvents = await prisma.event.findMany({
		where: {
			meta: {
				is: {
					date: { gte: startDate.toJSDate(), lte: endDate.toJSDate() }
				}
			}
		}
	});
	return json(returnEvents);
}
