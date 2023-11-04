<script lang="ts">
	import type { DraftEvent } from '$lib/types/event';
	import { onMount } from 'svelte';
	import { player_access } from '$lib/stores/PlayerStore';
	import { DateTime } from 'luxon';
	import { fly } from 'svelte/transition';
	import defaultAvatar from '$lib/images/base-discord.png';
	import PlayerButton from '../player-button/PlayerButton.svelte';

	export let draft: DraftEvent;
	let players: { id: string; gwp: number; mp: number; omp?: number; ogp?: number }[] = [];
	let playerMap = new Map<string, Map<string, { gw: number; gl: number; gt: number; r: 'WIN' | 'LOSE' | 'TIE' | 'BYE'; rnd: number }>>();
	onMount(() => {
		// Add each player to the map, with the opponents and their scores against that player.
		// Calculate GWP
		// Calculate MWP
		// Get all opponents, calculate OMP
		// Get all opponents, calculate OGP
		for (const prop in draft) {
			if (prop.startsWith('R_')) {
				for (const match of draft[prop as `R_${number}`]) {
					if (match.players.length === 1) {
						playerMap.get(match.players[0])?.set(`BYE_${prop}`, { gt: 0, gl: 0, gw: 0, r: 'BYE', rnd: parseInt(prop.at(-1)!) });
					} else {
						const p0_wins = match.games?.filter((v) => v === 0).length ?? match.scores?.at(0) ?? 0;
						const p1_wins = match.games?.filter((v) => v === 1).length ?? match.scores?.at(1) ?? 0;
						const ties = match.games?.filter((v) => v === -1).length ?? 0;
						const p0_result = p0_wins === 2 || (p0_wins === 1 && p1_wins === 0) ? 'WIN' : p0_wins === p1_wins ? 'TIE' : 'LOSE';
						const p1_result = p1_wins === 2 || (p1_wins === 1 && p0_wins === 0) ? 'WIN' : p1_wins === p0_wins ? 'TIE' : 'LOSE';
						if (playerMap.get(match.players[0])?.get(match.players[1])) {
							playerMap.get(match.players[0])?.set(`REMATCH_${match.players[1]}`, {
								gw: p0_wins,
								gt: ties,
								gl: p1_wins,
								r: p0_result,
								rnd: parseInt(prop.at(-1)!)
							});
						} else if (
							playerMap.get(match.players[0])?.set(match.players[1], {
								gw: p0_wins,
								gt: ties,
								gl: p1_wins,
								r: p0_result,
								rnd: parseInt(prop.at(-1)!)
							}) === undefined
						)
							playerMap.set(
								match.players[0],
								new Map([[match.players[1], { gw: p0_wins, gl: p1_wins, gt: ties, r: p0_result, rnd: parseInt(prop.at(-1)!) }]])
							);
						if (playerMap.get(match.players[1])?.get(match.players[0])) {
							playerMap.get(match.players[1])?.set(`REMATCH_${match.players[0]}`, {
								gw: p1_wins,
								gt: ties,
								gl: p0_wins,
								r: p1_result,
								rnd: parseInt(prop.at(-1)!)
							});
						} else if (
							playerMap.get(match.players[1])?.set(match.players[0], {
								gw: p1_wins,
								gt: ties,
								gl: p0_wins,
								r: p1_result,
								rnd: parseInt(prop.at(-1)!)
							}) === undefined
						)
							playerMap.set(
								match.players[1],
								new Map([[match.players[0], { gw: p1_wins, gl: p0_wins, gt: ties, r: p1_result, rnd: parseInt(prop.at(-1)!) }]])
							);
					}
				}
			}
		}
		const newPlayers: Map<string, { id: string; gwp: number; mp: number; omp?: number; ogp?: number; mwp?: number }> = new Map();
		for (const [id, subMap] of playerMap) {
			let total_mp = 0;
			let total_gp = 0;
			let total_games = 0;
			let won_matches = 0;
			for (const [subId, subScore] of subMap) {
				if (subId.startsWith('BYE_')) {
					total_mp = total_mp + 3;
				} else {
					total_mp = total_mp + (subScore.r === 'WIN' || subScore.r === 'BYE' ? 3 : subScore.r === 'LOSE' ? 0 : 1);
					total_gp = total_gp + subScore.gw;
					total_games = total_games + subScore.gt + subScore.gw + subScore.gl;
					won_matches = won_matches + (subScore.r === 'WIN' ? 1 : 0);
				}
			}
			newPlayers.set(id, { id, gwp: total_gp / total_games, mp: total_mp, mwp: won_matches / subMap.size });
		}
		for (const [id, subMap] of playerMap) {
			let thisPlayer = newPlayers.get(id)!;
			let gwpSum = 0;
			let mpSum = 0;
			for (const [subId, subScore] of subMap) {
				gwpSum = gwpSum + (newPlayers.get(subId)?.gwp ?? 0);
				mpSum = mpSum + (newPlayers.get(subId)?.mwp ?? 0);
			}
			newPlayers.set(id, { ...thisPlayer, omp: mpSum / subMap.size, ogp: gwpSum / subMap.size });
		}
		players = [...newPlayers].map((m) => m[1]);
		players.sort((a, b) => {
			if (a.mp > b.mp) return -1;
			if (a.mp < b.mp) return 1;
			if (a.gwp > b.gwp) return -1;
			if (a.gwp < b.gwp) return 1;
			if (a.omp! > b.omp!) return -1;
			if (a.omp! < b.omp!) return 1;
			if (a.ogp! > b.ogp!) return -1;
			if (a.ogp! < b.ogp!) return 1;
			return 0;
		});
	});
	$: selectedPlayer = '';
	$: selectedPlayerStats = players.find((p) => p.id === selectedPlayer);
</script>

<div class="container">
	<div>
		<h1 class="display-text">{draft.meta.title}</h1>
		<p class="statistic-text date-text">{DateTime.fromISO(draft.meta.date).toLocaleString(DateTime.DATE_FULL)}</p>
		<div class="subtitle-text">{draft.meta.description ?? ''}</div>
	</div>
	<div class="table">
		{#each players as player}
			<button class="table-row username-text" on:click={() => (selectedPlayer !== player.id ? (selectedPlayer = player.id) : (selectedPlayer = ''))}>
				{#await $player_access.get(player.id)}
					Loading players...
				{:then res}
					{res?.global_name ?? res?.username ?? 'Unknown Player'}
				{/await}
				<span class="statistic-text">
					{player.mp}
				</span>
			</button>
		{/each}
	</div>
	{#each players as p}
		{#if selectedPlayer === p.id}
			<div class="bump-right" in:fly={{ x: -300 }} out:fly={{ x: -300 }}>
				<div class="bump-right-heading display-text">
					{#await $player_access.get(selectedPlayer)}
						Loading...
					{:then res}
						{#if res !== undefined}
							<PlayerButton {res} />
						{/if}
					{/await}
				</div>
				<div class="bump-right-stats statistic-text">
					<div><span>PTS:</span><span>{selectedPlayerStats?.mp}</span></div>
					<div><span>GWP:</span><span>{selectedPlayerStats?.gwp.toFixed(2)}</span></div>
					<div><span>OMW:</span><span>{selectedPlayerStats?.omp?.toFixed(2)}</span></div>
					<div><span>OGP:</span><span>{selectedPlayerStats?.ogp?.toFixed(2)}</span></div>
				</div>
				<div class="bump-right-picture">
					<img src="" alt="" />
				</div>
				<div class="bump-right-rounds">
					{#each playerMap.get(selectedPlayer)?.entries() ?? [] as [id, m]}
						<div class="round">
							<div class="statistic-text round-text">{m.rnd + 1}</div>
							<span class="m-result statistic-text">
								{#if id.startsWith('BYE')}BYE{:else}{m.gw}-{m.gl}{/if}
							</span>
							{#if id.startsWith('BYE')}
								<PlayerButton small={true} />
							{:else}
								{#await $player_access.get(id.replace('REMATCH_', '')) then res}
									<PlayerButton {res} small={true} />
								{/await}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	.container {
		background: var(--background);
		padding: 15px;
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto auto;
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
	.round-text {
		position: absolute;
		left: -23px;
		background-color: var(--primary);
		color: var(--secondary);
		border-radius: 0 50% 50% 0;
		width: 1.125rem;
		text-align: right;
		padding-right: 5px;
		box-shadow: 0px 5px 15px black;
	}
	.subtitle-text {
		text-align: start;
	}
	.display-text {
		margin: 0;
		font-size: 3.4em;
	}
	.date-text {
		margin: 0;
		font-size: small;
		width: fit-content;
		white-space: nowrap;
		position: relative;
		z-index: 0;
	}
	.table-row::after {
		position: absolute;
		bottom: 0;
		left: -15px;
		width: calc(100% + 30px);
		height: 0px;
		content: '';
		background-color: var(--accent);
		opacity: 0.75;
		transform-origin: 50% 100%;
		transition: height 200ms ease-in-out;
		z-index: -1;
	}
	.table-row:hover::after {
		height: 50%;
	}
	.table {
		display: flex;
		flex-direction: column;
		justify-content: end;
		gap: 8px;
	}
	.table-row {
		z-index: 0;
		margin: 0;
		font-size: large;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		appearance: none;
		border: none;
		background-color: transparent;
		padding: 0;
		cursor: pointer;
		position: relative;
	}
	.bump-right {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 15px;
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
	}
	.bump-right-heading {
		height: 80px;
	}
	.bump-right-stats {
		display: grid;
		grid-template-columns: 100%;
		font-size: smaller;
	}
	.bump-right-stats > div > span:nth-child(2n) {
		text-align: right;
	}
	.bump-right-stats > div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		position: relative;
	}
	.bump-right-picture {
		margin-top: auto;
	}
	.round {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		gap: 15px;
		position: relative;
		max-height: 54px;
	}
	.m-result {
		font-size: 40px;
	}
</style>
