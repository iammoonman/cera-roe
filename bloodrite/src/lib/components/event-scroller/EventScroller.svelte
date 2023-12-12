<script lang="ts">
	import DraftButton from '$lib/components/draft-button/DraftButton.svelte';
	import { event_store } from '$lib/stores/EventStore';
	import { ServerStartDate } from '$lib/types/server-specific';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	$: allDates = [] as { id: number; date: DateTime }[];
	onMount(() => {
		let newDates = [];
		for (let i = 0; i > Math.floor(DateTime.fromFormat(ServerStartDate, 'LLLL dd yyyy').startOf('month').diffNow('month').months) - 2; i--) {
			let date = DateTime.now()
				.startOf('month')
				.plus({ months: i + 2 });
			newDates.push({ id: i, date });
		}
		allDates = newDates;
	});
</script>

<div class="scroll-root">
	{#each allDates as data}
		<div class="week-block">
			<p class="statistic-text full-date-text">{data.date.toFormat('LLLL yyyy')}</p>
			<svg class="week-num display-text" viewBox="0 0 30 12">
				<text x="0" y="11.5">{`${allDates.length + data.id}`.padStart(3, '0')}</text>
			</svg>
			<div class="buttons-block">
				{#await $event_store.getByMonth(data.date.year, data.date.month) then res}
					{#each res as d}
						<DraftButton draft={d} />
					{/each}
				{/await}
			</div>
		</div>
	{/each}
</div>

<style>
	.scroll-root {
		position: relative;
		height: var(--max-event-height, 500px);
		width: 100%;
		overflow-x: clip;
		overflow-y: scroll;
		background-color: var(--background);
	}
	.week-block {
		height: 140px;
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow-x: clip;
		z-index: 0;
	}
	.week-block::after,
	.week-block::before {
		content: '';
		width: 0;
		transition: width 200ms linear;
		position: absolute;
		height: 100%;
		background: linear-gradient(to bottom, var(--accent) 0 5%, transparent 5% 95%, var(--accent) 95% 100%);
		opacity: 0.35;
		z-index: -1;
	}
	.week-block::after {
		right: 0;
	}
	.week-block::before {
		left: 0;
	}
	.week-block:hover::after,
	.week-block:hover::before {
		width: 50%;
	}
	.week-num {
		height: calc(100% - 5px);
		fill: var(--primary, black);
		opacity: 0.65;
		flex-shrink: 0;
		position: absolute;
		cursor: default;
		user-select: none;
	}
	.buttons-block {
		display: flex;
		margin-left: auto;
		flex-grow: 1;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		flex-wrap: wrap;
		right: 0;
		position: relative;
	}
	.full-date-text {
		position: absolute;
		left: 10px;
		top: 10px;
		margin: 0;
	}
</style>
