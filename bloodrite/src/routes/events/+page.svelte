<script lang="ts">
	import DraftButton from '$lib/components/draft-button/DraftButton.svelte';
	import { event_store } from '$lib/stores/EventStore';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	$: allDates = [] as any[];
	onMount(() => {
		let newDates = [];
		for (let i = 0; i > Math.floor(DateTime.fromFormat('May 19 2018', 'LLLL dd yyyy').startOf('week').diffNow('weeks').weeks + 2); i--) {
			let date = DateTime.now()
				.startOf('week')
				.plus({ weeks: i + 2 });
			newDates.push({ id: i, date });
		}
		allDates = newDates;
		const startDate = DateTime.fromObject({ weekYear: 2023, weekNumber: 12 }).startOf('week');
		console.log(startDate.toJSDate());
	});
	// May 19, 2018
	import VirtualScroll from 'svelte-virtual-scroll-list';
</script>

<header>The Rat Zone</header>
<div class="scroll-root">
	<VirtualScroll data={allDates} key="id" let:data>
		<div class="week-block">
			{#await $event_store.getByWeek(data.date.year, data.date.weekNumber) then res}
				<div class="week-num">Week {allDates.length + data.id}</div>
				{#each [0, 1, 2, 3, 4, 5, 6] as day}
					<div
						class={`month-${data.date.plus({ days: day }).month} dayblock`}
						class:today={data.date.plus({ days: day }).startOf('day').equals(DateTime.now().startOf('day'))}
					>
						<span class="day-text">
							{data.date.plus({ days: day }).toFormat('ccc, LLL dd, yyyy')}
						</span>
						{#each res.filter((dr) => DateTime.fromISO(dr.meta.date).startOf('day').weekday - 1 === day) as d}
							<DraftButton draft={d} />
						{/each}
					</div>
				{/each}
			{/await}
		</div>
	</VirtualScroll>
</div>

<style>
	header {
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		padding: 4px;
	}
	.scroll-root {
		position: relative;
		height: 100%;
	}
	.week-block {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: 1fr;
		height: 200px;
		gap: 5px;
		padding: 2.5px;
		position: relative;
	}
	.dayblock {
		display: grid;
		outline: 1px solid black;
		place-items: center;
		border-radius: 5px;
		position: relative;
	}
	.today {
		box-shadow: inset 0 0 15px 15px white;
	}
	.day-text {
		position: absolute;
		top: 0;
		right: 0;
		margin: 10px;
	}
	.month-1 {
		background: linear-gradient(0.15turn, rgba(255, 255, 255, 0.15), rgba(0, 162, 255, 0.15));
	}
	.month-2 {
		background: linear-gradient(0.15turn, rgba(240, 155, 155, 0.15), rgba(255, 50, 50, 0.15));
	}
	.month-3 {
		background: linear-gradient(0.15turn, rgba(26, 132, 0, 0.15), rgba(191, 94, 255, 0.15));
	}
	.month-4 {
		background: linear-gradient(0.15turn, rgba(221, 255, 25, 0.15), rgba(255, 255, 205, 0.15));
	}
	.month-5 {
		background: linear-gradient(0.15turn, rgba(244, 184, 236, 0.15), rgba(244, 232, 255, 0.15));
	}
	.month-6 {
		background: linear-gradient(0.15turn, rgba(156, 210, 157, 0.15), rgba(244, 244, 139, 0.15));
	}
	.month-7 {
		background: linear-gradient(0.15turn, rgba(255, 244, 147, 0.15), rgba(255, 243, 178, 0.15));
	}
	.month-8 {
		background: linear-gradient(0.15turn, rgba(162, 43, 0, 0.15), rgba(255, 164, 16, 0.15));
	}
	.month-9 {
		background: linear-gradient(0.15turn, rgba(236, 135, 4, 0.15), rgba(44, 195, 250, 0.15));
	}
	.month-10 {
		background: linear-gradient(0.15turn, rgba(255, 25, 140, 0.15), rgba(4, 0, 255, 0.15));
	}
	.month-11 {
		background: linear-gradient(0.15turn, rgba(255, 209, 25, 0.15), rgba(107, 75, 0, 0.15));
	}
	.month-12 {
		background: linear-gradient(0.15turn, rgba(0, 85, 7, 0.15), rgba(255, 30, 30, 0.15));
	}
	.week-num {
		position: absolute;
		top: 0;
		left: 7px;
		font-size: xx-large;
	}
</style>
