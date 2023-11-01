<script lang="ts">
	import type { DraftEvent } from '$lib/types/event';
	import { onMount } from 'svelte';
	import { player_access } from '$lib/stores/PlayerStore';
	import { DateTime } from 'luxon';

	export let draft: DraftEvent;
	let players: { id: string; gwp: number; mp: number; omp?: number; ogp?: number }[] = [];
	let playerMap = new Map<string, Map<string, { gw: number; gl: number; gt: number; r: 'WIN' | 'LOSE' | 'TIE' | 'BYE' }>>();
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
						playerMap.get(match.players[0])?.set(`BYE_${prop}`, { gt: 0, gl: 0, gw: 0, r: 'BYE' });
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
								r: p0_result
							});
						} else if (
							playerMap.get(match.players[0])?.set(match.players[1], {
								gw: p0_wins,
								gt: ties,
								gl: p1_wins,
								r: p0_result
							}) === undefined
						)
							playerMap.set(match.players[0], new Map([[match.players[1], { gw: p0_wins, gl: p1_wins, gt: ties, r: p0_result }]]));
						if (playerMap.get(match.players[1])?.get(match.players[0])) {
							playerMap.get(match.players[1])?.set(`REMATCH_${match.players[0]}`, {
								gw: p1_wins,
								gt: ties,
								gl: p0_wins,
								r: p1_result
							});
						} else if (
							playerMap.get(match.players[1])?.set(match.players[0], {
								gw: p1_wins,
								gt: ties,
								gl: p0_wins,
								r: p1_result
							}) === undefined
						)
							playerMap.set(match.players[1], new Map([[match.players[0], { gw: p1_wins, gl: p0_wins, gt: ties, r: p1_result }]]));
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
	<h3>{draft.meta?.title}</h3>
	<p>{DateTime.fromISO(draft.meta?.date ?? '2023-01-01T06:30:00.000-05:00').toLocaleString(DateTime.DATETIME_SHORT)}</p>
	<div>IMAGE</div>
	<div class="table">
		{#each players as player}
			<div class="table-row">
				{#await $player_access.get(player.id)}
					Loading players...
				{:then res}
					{res?.global_name ?? res?.username ?? 'Unknown Player'}
					<span>
						{player.mp}
						<button on:click={() => (selectedPlayer !== player.id ? (selectedPlayer = player.id) : (selectedPlayer = ''))}>></button>
					</span>
				{/await}
			</div>
		{/each}
	</div>
	{#if selectedPlayer !== ''}
		<div class="bump-right">
			<div class="bump-right-heading">
				{#await $player_access.get(selectedPlayer)}
					Loading...
				{:then res}
					<img class="player-avatar" src={`https://cdn.discordapp.com/avatars/${res?.id}/${res?.avatar ?? ''}.jpg`} alt="player avatar" />
					<p>{res?.global_name ?? res?.username ?? 'Unknown Player'}</p>
				{/await}
			</div>
			<div class="bump-right-stats">
				<span>PTS:</span><span>{selectedPlayerStats?.mp}</span>
				<span>GWP:</span><span>{selectedPlayerStats?.gwp.toFixed(2)}</span>
				<span>OMW:</span><span>{selectedPlayerStats?.omp?.toFixed(2)}</span>
				<span>OGP:</span><span>{selectedPlayerStats?.ogp?.toFixed(2)}</span>
			</div>
			<div class="bump-right-picture">
				<img src="" alt="deckpic" />
			</div>
			<div class="bump-right-rounds">
				{#each playerMap.get(selectedPlayer)?.entries() ?? [] as [id, m]}
					<div class="round">
						<span class="m-result">{m.gw}-{m.gl}</span>
						{#await $player_access.get(id) then res}
							{#if res === undefined}
								<div>BYE</div>
							{:else}
								<img class="player-avatar sm" src={`https://cdn.discordapp.com/avatars/${res?.id}/${res?.avatar ?? ''}.jpg`} alt="player avatar" />
								<span>{res?.global_name ?? res?.username ?? 'Unknown Player'}</span>
							{/if}
						{/await}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		background: white;
		padding: 15px;
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: 30px 3rem auto auto;
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
	.table {
		display: grid;
		grid-template-rows: auto-fill;
	}
	.table-row {
		margin: 0;
		height: 1.125rem;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
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
		background-color: white;
		left: 100%;
		width: 15rem;
		z-index: -2;
		box-shadow: 0px 4px 10px black;
	}
	.bump-right-heading {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		font-size: larger;
		gap: 15px;
	}
	.player-avatar {
		border-radius: 50%;
		height: 80px;
		box-shadow: 0 5px 15px black;
	}
	.player-avatar.sm {
		height: 40px;
	}
	.bump-right-stats {
		display: grid;
		grid-template-columns: auto auto;
	}
	.bump-right-stats > span:nth-child(2n) {
		text-align: right;
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
	}
	.m-result {
		font-size: 40px;
	}
</style>
