<script lang="ts">
	import type { EloRatingRecord, Player } from '$lib/types/player';
	import { event_store } from '$lib/stores/EventStore';
	import * as d3 from 'd3';
	export let player: Player;
	let svgParent: HTMLDivElement;
	const [mX, mY] = [35, 17];
	let gx: SVGGElement;
	let gy: SVGGElement;
	$: x = d3.scaleLinear([0, 64], [mX, svgParent?.clientWidth ?? 300]);
	$: y = d3.scaleLinear([800, 1400], [(svgParent?.clientHeight ?? 300) - mY, mY]);
	$: d3.select(gy).call(d3.axisLeft(y)).style('color', 'white');
	$: d3.select(gx).call(d3.axisBottom(x)).style('color', 'white');
	$: line = d3.line(
		(d: EloRatingRecord) => x(parseInt(d.event)),
		(d: EloRatingRecord) => y(d.newrating)
	);
	let hovered_id: string | undefined = undefined;
</script>

<div class="container">
	<div class="statistic-text ttle">
		{#if hovered_id}
			{#await $event_store.get(hovered_id)}
				Loading...
			{:then res}
                {@const ratings = [
                    player.tag_data.dps?.find((v) => parseInt(v.event ?? '1') === parseInt(hovered_id ?? '0') - 1)?.newrating ?? 1000,
                    player.tag_data.dps?.find((v) => v.event === hovered_id)?.newrating ?? 1000
                ]}
				{res?.meta?.title}
                <span>
				<span class="statistic-text" class:plus={ratings[0] <= ratings[1]} class:minus={ratings[0] > ratings[1]}>
                    {(ratings[1] - ratings[0]).toFixed(2)}
				</span>
                <span class="statistic-text">{ratings[1].toFixed(2)}</span>
                </span>
			{/await}
		{:else}
			Hover an event to see the record.
		{/if}
	</div>
	<div class="svg-parent" bind:this={svgParent}>
		<svg width={svgParent?.clientWidth ?? 300} height={svgParent?.clientHeight ?? 300} role="figure" on:mouseenter={() => (hovered_id = undefined)}>
			<path fill="none" stroke="white" stroke-width="1.5" d={line(player?.tag_data.dps ?? [])} />
			<g fill="white" stroke="currentColor" stroke-width="1.5">
				{#each player?.tag_data.dps ?? [] as d, i}
					<circle
						cx={x(parseInt(d.event))}
						cy={y(d.newrating)}
						r={hovered_id === d.event ? '4.0' : '2.5'}
						role="figure"
						on:focus={() => (hovered_id = d.event)}
						on:mouseover={() => (hovered_id = d.event)}
					/>
				{/each}
			</g>
			<g bind:this={gx} transform="translate(0, {(svgParent?.clientHeight ?? 300) - mY})" />
			<g bind:this={gy} transform="translate({mX}, 0)" />
		</svg>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.svg-parent {
		flex: 1 1;
	}
	.svg-parent > svg {
		position: absolute;
	}
	.plus {
		color: #00a000;
	}
	.plus::before {
		content: '+';
	}
	.minus {
		color: var(--accent-light);
	}
    .ttle {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: nowrap;
        white-space: nowrap;
        font-size: 0.9em;
    }
</style>
