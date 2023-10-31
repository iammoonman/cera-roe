import type { DraftEvent } from '$lib/types/event';
import { readable, readonly } from 'svelte/store';

class EventStore {
	private events = new Map<string, DraftEvent>();
	private eventPromises = new Map<string, Promise<any>>();
	async get(eventId: string): Promise<DraftEvent> {
		return {} as DraftEvent;
	}
	async getByWeek(week: number, year: number): Promise<DraftEvent[]> {
		return [];
	}
}

const event_store_internal = readable(new EventStore());

export const event_store = readonly(event_store_internal);
