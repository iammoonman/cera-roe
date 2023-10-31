import { json } from '@sveltejs/kit';
import type { DraftEvent } from '$lib/types/event';

export async function GET({ params: { week, year } }) {
	return json(
		[
			{
				id: '1145133824834031726',
				meta: {
					tag: 'ptm',
					date: '2023-08-26',
					description: 'we ball at the ball',
					title: 'ELDRAINE 2',
					set_code: 'eld'
				},
				0: [
					{
						players: ['237059875073556481', '514143771697479702'],
						games: [0, 0]
					},
					{
						players: ['134163009231650816', '94151949280088064'],
						games: [0, 0]
					},
					{
						players: ['291284546769649674', '304532246105423873'],
						games: [1, 1]
					},
					{
						players: ['855999010863054870', '97905054249398272'],
						games: [1, 0, 0]
					}
				],
				1: [
					{
						players: ['237059875073556481', '304532246105423873'],
						games: [0, 1, 1]
					},
					{
						players: ['134163009231650816', '855999010863054870'],
						games: [0, 0]
					},
					{
						players: ['97905054249398272', '291284546769649674'],
						games: [0, 1, 1]
					}
				],
				2: [
					{
						players: ['304532246105423873', '291284546769649674'],
						games: [0, 0]
					},
					{
						players: ['237059875073556481']
					}
				]
			} as DraftEvent
		],
		{ headers: { 'cache-control': 'max-age=604800' } }
	);
}
