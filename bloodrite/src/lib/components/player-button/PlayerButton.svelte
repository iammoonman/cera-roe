<script lang="ts">
	import { getMember } from '$lib/stores/MemberStore';
	import defaultAvatar from '$lib/images/base-discord.png';
	import { getHighestRank } from '$lib/types/server-specific';

	export let user_id: string;
	export let small: boolean = false;
</script>

{#await getMember(user_id)}
	<img class="player-avatar" class:lg={!small} src={defaultAvatar} alt="avatar" />
	<p class="username-text score-player" class:sm={small}>Loading...</p>
{:then res}
	<img
		class="player-avatar"
		style={res?.roles.length === 0 ? '' : `--rank-outline-color: ${getHighestRank(res?.roles ?? []).color};`}
		src={res?.avatar ? res.avatar : defaultAvatar}
		alt="missing avatar"
	/>
	<p class="username-text score-player" class:sm={small}>{res?.name ?? ''}</p>
{/await}

<style>
	.player-avatar {
		border-radius: 50%;
		height: clamp(0px, 100%, 4rem);
		aspect-ratio: 1 / 1;
		outline: 3px solid var(--rank-outline-color, var(--pico-secondary));
		background-color: var(--pico-primary-background);
		text-align: center;
		font-size: 0.5rem;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	.score-player {
		text-align: left;
		text-overflow: ellipsis;
		overflow: hidden;
		overflow-wrap: normal;
	}
	p {
		margin: 0;
	}
</style>
