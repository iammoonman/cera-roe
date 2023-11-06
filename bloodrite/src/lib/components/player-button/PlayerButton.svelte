<script lang="ts">
	import type { Member } from '$lib/stores/PlayerStore';
	import defaultAvatar from '$lib/images/base-discord.png';
	import { getHighestRank } from '$lib/types/server-specific';

	export let res: Member | undefined = undefined;
	export let small: boolean = false;
</script>

<div>
	{#if res === undefined}
		<img class="player-avatar" class:lg={!small} src={defaultAvatar} alt="avatar" />
	{:else}
		<img
			class="player-avatar"
			class:lg={!small}
			style={res.roles?.length === 0 ? '' : `--rank-outline-color: ${getHighestRank(res.roles ?? []).color};`}
			src={res.avatar ? `https://cdn.discordapp.com/avatars/${res.id}/${res.avatar}.jpg` : defaultAvatar}
			alt="avatar"
		/>
		<span class="username-text score-player" class:sm={small}>{res.name}</span>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 7px;
		padding: 0;
		position: relative;
		height: 100%;
	}
	.player-avatar {
		border-radius: 50%;
		height: 100%;
		aspect-ratio: 1 / 1;
		outline: 3px solid var(--rank-outline-color, var(--primary, black));
		font-size: 12px;
		text-align: center;
		color: white;
	}
	.lg {
		height: 5cqh;
	}
	.score-player {
		font-size: 16px;
		margin: 0;
		flex-shrink: 0;
		text-overflow: ellipsis;
		overflow: hidden;
		text-align: left;
	}
	.sm {
		font-size: 12px;
	}
</style>
