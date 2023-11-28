import { readable, readonly, writable } from 'svelte/store';

export type Member = {
	id: string;
	roles: string[];
	joined_at?: string;
	name: string;
	avatar: string | null;
	accent_color: string | null;
};

class MemberStore {
	private members = new Map<string, Member>();
	private memberPromises = new Map<string, Promise<any>>();
	async get(memberId: string) {
		if (this.members.get(memberId) === undefined) {
			if (this.memberPromises.get(memberId) === undefined)
				this.memberPromises.set(
					memberId,
					fetch(`/users/${memberId}`)
						.then((v) => v.json())
						.then((v) => {
							if (Object.hasOwn(v, 'id')) this.members.set(memberId, v);
						})
				);
			await this.memberPromises.get(memberId);
			member_access_list_internal.set(this.getAll());
		}
		return this.members.get(memberId);
	}
	getAll() {
		return this.members.values();
	}
}

const member_access = new MemberStore();
export const getMember = member_access.get.bind(member_access);
const member_access_list_internal = writable(member_access.getAll());
export const member_access_list = readonly(member_access_list_internal);
