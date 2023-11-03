import type { DraftEvent } from '$lib/types/event';
import { DateTime } from 'luxon';
import { readable, readonly } from 'svelte/store';

class EventStore {
	private events = new Map<string, DraftEvent>();
	private eventPromises = new Map<string, Promise<any>>();
	async get(eventId: string): Promise<DraftEvent> {
		return {} as DraftEvent;
	}
	async getByWeek(year: number, week: number): Promise<DraftEvent[]> {
		if (this.eventPromises.get(`${year}/${week}`) === undefined) {
			this.eventPromises.set(
				`${year}/${week}`,
				fetch(`/events/${year}/${week}`)
					.then((v) => v.json())
					.then((v: DraftEvent[]) => v.map((e) => this.events.set(e.id, e)))
			);
			await this.eventPromises.get(`${year}/${week}`);
		}
		const output: DraftEvent[] = []
		const startDate = DateTime.fromObject({ weekYear: year, weekNumber: week }).startOf('week');
		const endDate = DateTime.fromObject({ weekYear: year, weekNumber: week }).endOf('week');
		for (let [id, ev] of this.events) {
			if (ev.meta.date === undefined) continue;
			console.log(ev.meta);
			const thisDate = DateTime.fromISO(ev.meta.date);
			if (thisDate.diff(startDate).milliseconds >= 0 && thisDate.diff(endDate).milliseconds <= 0) output.push(ev)
		}
		return output;
	}
}

const event_store_internal = readable(new EventStore());

export const event_store = readonly(event_store_internal);
