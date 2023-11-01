<script lang="ts">
	import type { DraftEvent } from '$lib/types/event';
	import { onMount } from 'svelte';
	import { player_access } from '$lib/stores/PlayerStore';
	import { DateTime } from 'luxon';

	export let draft: DraftEvent;
	let players: { id: string; gwp: number; mp: number; omp?: number; ogp?: number }[] = [];
	onMount(() => {
		// Add each player to the map, with the opponents and their scores against that player.
		// Calculate GWP
		// Calculate MWP
		// Get all opponents, calculate OMP
		// Get all opponents, calculate OGP
		const playerMap = new Map<string, Map<string, { gw: number; gl: number; gt: number; r: 'WIN' | 'LOSE' | 'TIE' }>>();
		for (const prop in draft) {
			if (prop === 'R_0' || prop === 'R_1' || prop === 'R_2') {
				for (const match of draft[prop]) {
					if (match.players.length === 1) {
						playerMap.get(match.players[0])?.set(`BYE_${prop}`, { gt: 0, gl: 0, gw: 0, r: 'WIN' });
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
		const newPlayers: Map<string, { id: string; gwp: number; mp: number; omp?: number; ogp?: number }> = new Map();
		for (const [id, subMap] of playerMap) {
			let mp = 0;
			let gp = 0;
			let gt = 0;
			for (const [subId, subScore] of subMap) {
				if (subId.startsWith('BYE_')) {
					mp = mp + 3;
				} else {
					mp = mp + (subScore.r === 'WIN' ? 3 : subScore.r === 'LOSE' ? 0 : 1);
					gp = gp + subScore.gw;
					gt = gt + subScore.gt + subScore.gw + subScore.gl;
				}
			}
			newPlayers.set(id, { id, gwp: gp / gt, mp });
		}
		for (const [id, subMap] of playerMap) {
			let thisPlayer = newPlayers.get(id)!;
			let gwpSum = 0;
			let mpSum = 0;
			for (const [subId, subScore] of subMap) {
				gwpSum = gwpSum + (newPlayers.get(subId)?.gwp ?? 0);
				mpSum = mpSum + (newPlayers.get(subId)?.mp ?? 0);
			}
			newPlayers.set(id, { ...thisPlayer, omp: mpSum / subMap.size, ogp: gwpSum / subMap.size });
		}
		players = [...newPlayers].map((m) => m[1]);
	});
	$: {
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
	}
</script>

<div class="container">
	<h3>{draft.meta?.title}</h3>
	<p>{DateTime.fromISO(draft.meta?.date ?? '2023-01-01T06:30:00.000-05:00').toLocaleString(DateTime.DATETIME_SHORT)}</p>
	<div>IMAGE</div>
	<div class="table">
		{#each players as player}
			<div>
				{#await $player_access.get(player.id)}
					Loading players...
				{:then res}
					{res?.global_name ?? 'Unknown Player'}
				{/await}
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		background: white;
		padding: 15px;
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: 30px 1rem 60px auto;
		gap: 5px;
	}
	.table {
		display: grid;
		grid-template-rows: auto-fill;
	}
</style>
