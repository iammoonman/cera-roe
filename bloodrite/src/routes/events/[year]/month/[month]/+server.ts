import { json } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import prisma from '$lib/prisma';
import draft_0 from '../../../../../../static/event-data/1162893035823190087.json';
import draft_1 from '../../../../../../static/event-data/1144819777760665661.json';
import draft_2 from '../../../../../../static/event-data/1145133824834031726.json';
import draft_3 from '../../../../../../static/event-data/1157820229766889493.json';
import draft_4 from '../../../../../../static/event-data/1160355391763386579.json';

export async function GET({ params: { year, month } }) {
	const startDate = DateTime.fromObject({ year: parseInt(year), month: parseInt(month) }).startOf('month');
	const endDate = DateTime.fromObject({ year: parseInt(year), month: parseInt(month) }).endOf('month');
	// Should add an alternate source from the static event-data directory for when other people are developing without my keys.
	try {
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
	} catch (error) {
		return json([draft_0, draft_1, draft_2, draft_3, draft_4]);
	}
}
