<script lang="ts">
	import { getMember, type Member } from '$lib/stores/MemberStore';
	import defaultAvatar from '$lib/images/base-discord.png';
	import { getHighestRank } from '$lib/types/server-specific';
	import { onMount } from 'svelte';
	import type { Player } from '$lib/types/player';
	import { player_access } from '$lib/stores/PlayerStore';
	import DpsChart from './DPSChart.svelte';
	export let user_id: string;
	let user: Member | undefined;
	let player: Player | undefined;
	onMount(async () => {
		user = await getMember(user_id);
		player = await $player_access.get(user_id);
	});
</script>

<div class="container">
	<div class="description-text subtitle-text player-blob">
		<img
			class="player-avatar"
			style={user?.roles.length === 0 ? '' : `--rank-outline-color: ${getHighestRank(user?.roles ?? []).color};`}
			src={user?.avatar ? user.avatar : defaultAvatar}
			alt="avatar"
		/>
		<span class="display-text score-player">{user?.name ?? ''}</span>
	</div>
	<div class="content-section">
		<!-- For each of the user's card options, -->
		{#if player && player.tag_data.dps}<DpsChart {player} />{/if}
	</div>
	<div class="bump-right">
		<div class="bump-right-heading display-text">N</div>
	</div>
</div>

<style>
	.container {
		background: var(--pico-background-color);
		padding: 15px;
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: 5rem auto;
		place-items: start;
		gap: 5px;
		position: relative;
		height: 35rem;
		width: 25rem;
		border-radius: 15px;
	}
	.container::before {
		border-radius: 15px;
		position: absolute;
		background-color: transparent;
		height: 100%;
		width: 100%;
		content: '';
		box-shadow: 0px 5px 15px black;
		z-index: -1;
	}
	.content-section {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
	}

	.bump-right {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 7.5px;
		padding: 15px;
		border-radius: 0 15px 15px 0;
		top: 7.5%;
		height: 80%;
		background-color: var(--background);
		left: 100%;
		width: 15rem;
		z-index: -2;
		box-shadow: 0px 4px 10px black;
		overflow: clip;
		display: none;
	}
	.bump-right-heading {
		height: 80px;
	}
	.player-blob {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 7px;
		padding: 3px;
		position: relative;
		height: 100%;
		overflow-x: hidden;
	}
	.player-avatar {
		border-radius: 50%;
		height: 4rem;
		aspect-ratio: 1 / 1;
		outline: 3px solid var(--rank-outline-color, var(--pico-contrast));
		background-color: var(--pico-primary-background);
		font-size: 12px;
		text-align: center;
		color: white;
	}
	.score-player {
		margin: 0;
		font-size: 2rem;
		flex-shrink: 0;
		text-overflow: ellipsis;
		overflow: hidden;
		text-align: left;
	}
</style>
