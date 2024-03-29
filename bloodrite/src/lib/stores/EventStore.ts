import type { DraftEvent } from '$lib/types/event';
import { DateTime } from 'luxon';
import { readable, readonly } from 'svelte/store';

class EventStore {
	private events = new Map<string, DraftEvent>();
	private eventPromises = new Map<string, Promise<any>>();
	async get(eventId: string | undefined): Promise<DraftEvent> {
		if (eventId === undefined) return {} as DraftEvent;
		if (this.eventPromises.get(`id/${eventId}`) === undefined) {
			this.eventPromises.set(
				`id/${eventId}`,
				fetch(`events/id/${eventId}`)
					.then((v) => v.json())
					.then((v: DraftEvent) => this.events.set(v.id, v))
			);
			await this.eventPromises.get(`id/${eventId}`);
		}
		return this.events.get(eventId) ?? {} as DraftEvent;
	}
	async getByWeek(year: number, week: number): Promise<DraftEvent[]> {
		if (this.eventPromises.get(`${year}/week/${week}`) === undefined) {
			this.eventPromises.set(
				`${year}/week/${week}`,
				fetch(`/events/${year}/week/${week}`)
					.then((v) => v.json())
					.then((v: DraftEvent[]) => v.map((e) => this.events.set(e.id, e)))
			);
			await this.eventPromises.get(`${year}/week/${week}`);
		}
		const output: DraftEvent[] = []
		const startDate = DateTime.fromObject({ weekYear: year, weekNumber: week }).startOf('week');
		const endDate = DateTime.fromObject({ weekYear: year, weekNumber: week }).endOf('week');
		for (let [id, ev] of this.events) {
			if (ev.meta.date === undefined) continue;
			const thisDate = DateTime.fromISO(ev.meta.date);
			if (thisDate.diff(startDate).milliseconds >= 0 && thisDate.diff(endDate).milliseconds <= 0) output.push(ev)
		}
		return output;
	}
	async getByMonth(year: number, month: number): Promise<DraftEvent[]> {
		if (this.eventPromises.get(`${year}/month/${month}`) === undefined) {
			this.eventPromises.set(
				`${year}/month/${month}`,
				fetch(`/events/${year}/month/${month}`)
					.then((v) => v.json())
					.then((v: DraftEvent[]) => v.map((e) => this.events.set(e.id, e)))
			);
			await this.eventPromises.get(`${year}/month/${month}`);
		}
		const output: DraftEvent[] = []
		const startDate = DateTime.fromObject({ year: year, month: month }).startOf('month');
		const endDate = DateTime.fromObject({ year: year, month: month }).endOf('month');
		for (let [id, ev] of this.events) {
			if (ev.meta.date === undefined) continue;
			const thisDate = DateTime.fromISO(ev.meta.date);
			if (thisDate.diff(startDate).milliseconds >= 0 && thisDate.diff(endDate).milliseconds <= 0) output.push(ev)
		}
		return output;
	}
}

const event_store_internal = readable(new EventStore());

export const event_store = readonly(event_store_internal);
