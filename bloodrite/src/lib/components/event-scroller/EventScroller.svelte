<script lang="ts">
	import DraftButton from '$lib/components/draft-button/DraftButton.svelte';
	import { event_store } from '$lib/stores/EventStore';
	import { DateTime } from 'luxon';
	let month = 0;
	$: date = DateTime.now().startOf('month').plus({ months: month });
</script>

<div class="scroll-root">
	<button on:click={() => month--}>{date.minus({ months: 1 }).monthLong}</button>
	<h1 class="title">{date.monthLong}</h1>
	<button on:click={() => month++}>{date.plus({ months: 1 }).monthLong}</button>
	<div class="drafts">
		{#await $event_store.getByMonth(date.year, date.month) then res}
			{#each res as d}
				<DraftButton draft={d} />
			{/each}
		{/await}
	</div>
</div>

<style>
	.scroll-root {
		position: relative;
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: 15ch auto 15ch;
		width: 100%;
		padding-inline: 3ch;
		column-gap: 3ch;
		place-items: center;
	}
	.title {
		height: min-content;
		text-align: center;
	}
	.drafts {
		grid-column: 1 / span 3;
		display: flex;
		flex-direction: row;
		gap: 2ch;
		justify-content: center;
		flex-wrap: wrap;
		height: 100%;
	}
	button {
		width: 15ch;
	}
</style>
