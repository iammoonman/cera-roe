<script lang="ts">
	import type { DraftEvent } from '$lib/types/event';
	import { player_access } from '$lib/stores/PlayerStore';
	import { DateTime } from 'luxon';
	import { fly } from 'svelte/transition';
	import PlayerButton from '../player-button/PlayerButton.svelte';
	import Dps from '$lib/components/icons/dps.svelte';
	import Ptm from '$lib/components/icons/ptm_symbol.svelte';

	export let draft: DraftEvent;
	let players: Map<string, { id: string; gwp: number; mp: number; omp?: number; ogp?: number; mwp?: number }> = new Map();
	let scoresMap = new Map<string, Map<string, { gw: number; gl: number; gt: number; r: 'WIN' | 'LOSE' | 'TIE' | 'BYE'; rnd: number }>>();
	// Add each player to the map, with the opponents and their scores against that player.
	// Calculate GWP
	// Calculate MWP
	// Get all opponents, calculate OMP
	// Get all opponents, calculate OGP
	for (const prop in draft) {
		if (prop.startsWith('R_')) {
			for (const match of draft[prop as `R_${number}`]) {
				if (match.players.length === 1) {
					scoresMap.get(match.players[0])?.set(`BYE_${prop}`, { gt: 0, gl: 0, gw: 0, r: 'BYE', rnd: parseInt(prop.at(-1)!) });
				} else {
					const p0_wins = match.games?.filter((v) => v === 0).length ?? match.scores?.at(0) ?? 0;
					const p1_wins = match.games?.filter((v) => v === 1).length ?? match.scores?.at(1) ?? 0;
					const ties = match.games?.filter((v) => v === -1).length ?? 0;
					const p0_result = p0_wins === 2 || (p0_wins === 1 && p1_wins === 0) ? 'WIN' : p0_wins === p1_wins ? 'TIE' : 'LOSE';
					const p1_result = p1_wins === 2 || (p1_wins === 1 && p0_wins === 0) ? 'WIN' : p1_wins === p0_wins ? 'TIE' : 'LOSE';
					if (scoresMap.get(match.players[0])?.get(match.players[1])) {
						scoresMap.get(match.players[0])?.set(`REMATCH_${match.players[1]}`, {
							gw: p0_wins,
							gt: ties,
							gl: p1_wins,
							r: p0_result,
							rnd: parseInt(prop.at(-1)!)
						});
					} else if (
						scoresMap.get(match.players[0])?.set(match.players[1], {
							gw: p0_wins,
							gt: ties,
							gl: p1_wins,
							r: p0_result,
							rnd: parseInt(prop.at(-1)!)
						}) === undefined
					)
						scoresMap.set(
							match.players[0],
							new Map([[match.players[1], { gw: p0_wins, gl: p1_wins, gt: ties, r: p0_result, rnd: parseInt(prop.at(-1)!) }]])
						);
					if (scoresMap.get(match.players[1])?.get(match.players[0])) {
						scoresMap.get(match.players[1])?.set(`REMATCH_${match.players[0]}`, {
							gw: p1_wins,
							gt: ties,
							gl: p0_wins,
							r: p1_result,
							rnd: parseInt(prop.at(-1)!)
						});
					} else if (
						scoresMap.get(match.players[1])?.set(match.players[0], {
							gw: p1_wins,
							gt: ties,
							gl: p0_wins,
							r: p1_result,
							rnd: parseInt(prop.at(-1)!)
						}) === undefined
					)
						scoresMap.set(
							match.players[1],
							new Map([[match.players[0], { gw: p1_wins, gl: p0_wins, gt: ties, r: p1_result, rnd: parseInt(prop.at(-1)!) }]])
						);
				}
			}
		}
	}
	for (const [id, subMap] of scoresMap) {
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
		players.set(id, { id, gwp: total_gp / total_games, mp: total_mp, mwp: won_matches / subMap.size });
	}
	for (const [id, subMap] of scoresMap) {
		let thisPlayer = players.get(id)!;
		let gwpSum = 0;
		let mpSum = 0;
		for (const [subId, subScore] of subMap) {
			gwpSum = gwpSum + (players.get(subId)?.gwp ?? 0);
			mpSum = mpSum + (players.get(subId)?.mwp ?? 0);
		}
		players.set(id, { ...thisPlayer, omp: mpSum / subMap.size, ogp: gwpSum / subMap.size });
	}
	$: selectedPlayer = '';
</script>

<div class="container">
	{#if draft.meta.tag !== 'anti' && draft.meta.tag}
		<div class="tag-bump">
			{#if draft.meta.tag === 'dps'}<Dps />{/if}
			{#if draft.meta.tag === 'ptm'}<Ptm />{/if}
		</div>
	{/if}
	<div>
		<h1 class="display-text">{draft.meta.title}</h1>
		<p class="statistic-text date-text" title={DateTime.fromISO(draft.meta.date).toLocaleString(DateTime.DATETIME_FULL)}>
			{DateTime.fromISO(draft.meta.date).toLocaleString(DateTime.DATE_FULL)}
		</p>
		<div class="subtitle-text">{draft.meta.description ?? ''}</div>
	</div>
	<div class="table">
		{#each [...players.entries()].toSorted(([, a], [, b]) => {
			if (a.mp > b.mp) return -1;
			if (a.mp < b.mp) return 1;
			if (a.gwp > b.gwp) return -1;
			if (a.gwp < b.gwp) return 1;
			if ((a.omp ?? 0) > (b.omp ?? 0)) return -1;
			if ((a.omp ?? 0) < (b.omp ?? 0)) return 1;
			if ((a.ogp ?? 0) > (b.ogp ?? 0)) return -1;
			if ((a.ogp ?? 0) < (b.ogp ?? 0)) return 1;
			return 0;
		}) as [id, player]}
			<button class="table-row username-text" on:click={() => (selectedPlayer !== id ? (selectedPlayer = id) : (selectedPlayer = ''))}>
				{#await $player_access.get(id)}
					Loading player...
				{:then res}
					{res?.name ?? 'Unknown Player'}
				{/await}
				<span class="statistic-text">
					{player.mp}
				</span>
			</button>
		{/each}
	</div>
	{#each players.entries() as [id, player]}
		{#if selectedPlayer === id}
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
					<div title="Match Points"><span>PTS:</span><span>{player.mp ?? 'Loading...'}</span></div>
					<div title="Game Win Percentage"><span>GWP:</span><span>{player.gwp.toFixed(2) ?? 'Loading...'}</span></div>
					<div title="Opponent Match-win Percentage"><span>OMW:</span><span>{player.omp?.toFixed(2) ?? 'Loading...'}</span></div>
					<div title="Opponent Game-win Percentage"><span>OGP:</span><span>{player.ogp?.toFixed(2) ?? 'Loading...'}</span></div>
				</div>
				<div class="bump-right-picture">
					<img src="" alt="" />
				</div>
				<div class="bump-right-rounds">
					{#each scoresMap.get(selectedPlayer)?.entries() ?? [] as [id, m]}
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
	.tag-bump {
		position: absolute;
		border-radius: 0 0 15px 15px;
		background: var(--primary);
		display: grid;
		place-items: center;
		top: 0;
		right: 5%;
		padding-inline: 15px;
		height: 24px;
		--symbol-height: 25px;
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
		gap: 7.5px;
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
	.bump-right-rounds {
		display: flex;
		flex-direction: column;
		gap: 5px;
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
