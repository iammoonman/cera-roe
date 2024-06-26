<script lang="ts">
	import { getPlayersAndScores, type DraftEvent } from '$lib/types/event';
	import { getMember } from '$lib/stores/MemberStore';
	import { DateTime } from 'luxon';
	import { fly } from 'svelte/transition';
	import PlayerButton from '../player-button/PlayerButton.svelte';
	import Dps from '$lib/components/icons/dps.svelte';
	import Ptm from '$lib/components/icons/ptm_symbol.svelte';
	import Pencil from '$lib/components/icons/pencil.svelte';
	import { page } from '$app/stores';
	import { isAdmin } from '$lib/types/server-specific';
	import { player_access } from '$lib/stores/PlayerStore';

	export let draft: DraftEvent;

	// Add each player to the map, with the opponents and their scores against that player.
	// Calculate GWP
	// Calculate MWP
	// Get all opponents, calculate OMP
	// Get all opponents, calculate OGP
	let { players, scoresMap } = getPlayersAndScores(draft);
	$: selectedPlayer = '';
	$: editing = false;
</script>

<div class="container">
	{#if draft.meta.tag !== 'anti' && draft.meta.tag}
		<div class="tag-bump">
			{#if draft.meta.tag === 'dps'}<Dps />{/if}
			{#if draft.meta.tag === 'ptm'}<Ptm />{/if}
		</div>
	{/if}
	{#await getMember($page.data?.session?.user?.email ?? undefined) then member}
		{#if isAdmin(member?.roles ?? []) || member?.id === draft.meta.host}
			<button class="edit-bump" on:click={() => (editing = !editing)}>
				<Pencil />
			</button>
		{/if}
	{/await}
	<hgroup>
		<h1>{draft.meta.title}</h1>
		<p>{DateTime.fromISO(draft.meta.date.toString()).toLocaleString(DateTime.DATETIME_FULL)}</p>
	</hgroup>
	<blockquote>
		{draft.meta.description?.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '') ?? ''}
	</blockquote>
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
			<button class="table-row" on:click={() => (selectedPlayer !== id ? (selectedPlayer = id) : (selectedPlayer = ''))}>
				{#await getMember(id)}
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
	{#if editing}
		<div class="bump-left" in:fly={{ x: 300 }} out:fly={{ x: 300 }}>
			<label for="title" class="username-text">Title</label>
			<input type="text" id="title" value={draft.meta.title} maxlength="45" />
			<label for="tag" class="username-text">Tag</label>
			<select id="tag">
				<option value="dps">Draft Progression Series (2021)</option>
				<option value="ptm">Prime Time</option>
				<option value="anti">No tag</option>
			</select>
			<label for="desc" class="username-text">Description</label>
			<textarea id="desc" value={draft.meta.description} maxlength="450" />
		</div>
	{/if}
	{#each players.entries() as [id, player]}
		<div class="bump-right" class:selected={selectedPlayer === id}>
			<button class="bump-right-close-button" on:click={() => (selectedPlayer = '')}>X</button>
			<div class="player-button"><PlayerButton user_id={selectedPlayer} /></div>
			<div class="bump-right-stats statistic-text">
				<div class="stat-row" data-tooltip="Match Points"><span>PTS:</span><span>{player.mp ?? 'Loading...'}</span></div>
				<div class="stat-row" data-tooltip="Game Win Percentage"><span>GWP:</span><span>{player.gwp.toFixed(2) ?? 'Loading...'}</span></div>
				<div class="stat-row" data-tooltip="Opponent Match-win Percentage">
					<span>OMW:</span><span>{player.omp?.toFixed(2) ?? 'Loading...'}</span>
				</div>
				<div class="stat-row" data-tooltip="Opponent Game-win Percentage"><span>OGP:</span><span>{player.ogp?.toFixed(2) ?? 'Loading...'}</span></div>
				{#if draft.meta.tag === 'dps'}
					<div class="stat-row" data-tooltip="New ELO Rating">
						<span>RTG:</span>
						<span>
							{#await $player_access.get(id)}
								Loading...
							{:then res}
								{@const ratings = [
									res?.tag_data.dps?.find((v) => parseInt(v.event ?? '1') === parseInt(draft.id) - 1)?.newrating ?? 1000,
									res?.tag_data.dps?.find((v) => v.event === draft.id)?.newrating ?? 1000
								]}
								<span class:plus={ratings[0] <= ratings[1]} class:minus={ratings[0] > ratings[1]}>{(ratings[1] - ratings[0]).toFixed(2)}</span>
								{ratings[1]}
							{/await}
						</span>
					</div>
				{/if}
			</div>
			<div class="bump-right-picture">
				<!-- Will be a deckpic. Not sure about image hosting. -->
				<img src="" alt="" />
			</div>
			<div class="bump-right-rounds">
				{#each scoresMap.get(selectedPlayer)?.entries() ?? [] as [id, m]}
					<div class="round">
						<div class="statistic-text round-text">{m.rnd + 1}</div>
						<h2>
							{#if id.startsWith('BYE')}BYE{:else}{m.gw}-{m.gl}{/if}
						</h2>
						{#if id.startsWith('BYE')}
							<PlayerButton user_id={''} small={true} />
						{:else}
							<PlayerButton user_id={id.replace('REMATCH_', '')} small={true} />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.container {
		--padding-inline: 15px;
		background: var(--pico-background-color);
		display: flex;
		flex-direction: column;
		gap: 5px;
		position: relative;
		height: clamp(300px, 80vh, 35rem);
		width: clamp(300px, 50vw, 25rem);
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
	hgroup {
		position: relative;
		padding: var(--padding-inline);
		margin-bottom: 0;
	}
	blockquote {
		margin: 0;
	}
	.tag-bump {
		position: absolute;
		border-radius: 0 0 15px 15px;
		background: var(--pico-primary-background);
		display: grid;
		place-items: center;
		top: 0;
		right: 5%;
		padding-inline: var(--padding-inline, 15px);
		height: 24px;
	}
	.edit-bump {
		appearance: none;
		border: none;
		cursor: pointer;
		position: absolute;
		border-radius: 0 0 15px 15px;
		background: var(--pico-primary-background);
		display: grid;
		place-items: center;
		top: 0px;
		right: 20%;
		padding-inline: var(--padding-inline, 15px);
		height: 24px;
		transform-origin: 50% 0;
		scale: 1;
		transition: scale 200ms ease-in-out, box-shadow 200ms ease-in-out;
	}
	.edit-bump:hover {
		scale: 1.1;
		box-shadow: 0 5px 3px 0 black;
	}
	.edit-bump:active {
		scale: 0.9;
	}
	.table-row::after {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 0px;
		content: '';
		background-color: var(--pico-primary-hover);
		opacity: 0.75;
		transform-origin: 50% 100%;
		transition: height 200ms ease-in-out;
		z-index: -1;
	}
	.table-row:hover::after {
		height: 40%;
	}
	.table {
		display: flex;
		flex-direction: column;
		justify-content: end;
		gap: 7.5px;
		width: 100%;
		margin-top: auto;
		margin-bottom: 15px;
	}
	.table-row {
		z-index: 0;
		margin: 0;
		gap: 15px;
		font-size: large;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		appearance: none;
		border: none;
		background-color: transparent;
		padding: 0 var(--padding-inline, 15px);
		cursor: pointer;
		position: relative;
		color: unset;
	}
	@media (max-height: 35rem) {
		.table {
			flex-direction: row;
			flex-wrap: wrap;
		}
		.table-row {
			width: min-content;
			white-space: nowrap;
			height: min-content;
			outline: 1px solid #00000044;
		}
		.table-row > span {
			height: 0;
		}
		.table-row::after {
			content: none;
		}
	}
	.bump-left {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 7.5px;
		padding: var(--padding-inline, 15px);
		border-radius: 15px 0 0 15px;
		top: 7.5%;
		height: 80%;
		background: var(--pico-background-color);
		right: 100%;
		width: 15rem;
		z-index: -2;
		box-shadow: 0px 4px 10px black;
		overflow: clip;
	}
	.bump-right {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 7.5px;
		padding-top: var(--padding-inline, 15px);
		padding-bottom: var(--padding-inline, 15px);
		border-radius: 0 15px 15px 0;
		top: 7.5%;
		right: 0;
		height: 80%;
		background: var(--pico-background-color);
		width: 15rem;
		z-index: -2;
		box-shadow: 0px 4px 10px black;
		overflow: clip;
		transition: transform ease-in-out 200ms;
	}
	.bump-right.selected {
		transform: translateX(100%);
	}
	.bump-right:not(.selected) {
		box-shadow: none;
	}
	@media (max-width: 1000px) {
		.bump-right.selected {
			z-index: 1;
			transform: none;
			border-radius: 15px 0 0 15px;
			box-shadow: -3px 4px 10px black;
		}
		.bump-right {
			overflow-y: scroll;
		}
	}
	.bump-right-close-button {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
	}
	@media (max-width: 1000px) {
		.bump-right-close-button {
			display: block;
		}
	}
	.bump-right-stats {
		display: grid;
		grid-template-columns: 100%;
		font-size: smaller;
	}
	.bump-right-stats > div > span:nth-child(2n) {
		text-align: right;
	}
	.stat-row {
		padding-inline: var(--padding-inline, 15px);
	}
	.bump-right-stats > div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		position: relative;
	}
	.bump-right-picture {
		margin-top: auto;
		padding-inline: var(--padding-inline, 15px);
		flex-basis: 200%;
	}
	.bump-right-rounds {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.round {
		display: grid;
		grid-template-columns: 20px 60px 50px auto;
		align-items: center;
		position: relative;
		max-height: 54px;
		column-gap: 4px;
	}
	.round-text {
		background: var(--pico-primary-background);
		color: var(--pico-color);
		border-radius: 0 100% 100% 0;
		width: 1.125rem;
		text-align: center;
	}
	textarea {
		resize: none;
		height: 50%;
	}
	.plus {
		color: var(--pico-ins-color);
	}
	.plus::before {
		content: '+';
	}
	.minus {
		color: var(--pico-del-color);
	}
	h2 {
		margin: 0;
		margin-bottom: 8px;
		white-space: nowrap;
		text-align: center;
	}
	.player-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 5px;
		padding: 5px;
		min-height: 4rem;
	}
</style>
