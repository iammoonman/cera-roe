<script lang="ts">
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let label: string = '';
	export let set_symbol: string = 'mor';
	export let color: 'colorless' | 'white' | 'blue' | 'black' | 'red' | 'green' | 'gold' =
		'colorless';
</script>

<svelte:head>
	<link
		href="//cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css"
		rel="stylesheet"
		type="text/css"
	/>
</svelte:head>
<button type="button" class={`button button--${size} button--${color}`} on:click>
	{label}
	{#if set_symbol}<i class={`ss ss-${set_symbol}`} />{/if}
</button>

<style>
	.button {
		font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 700;
		border: 0;
		border-radius: 1rem / 2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		line-height: 1;
		transition: scale 50ms ease-in;
		perspective: 100px;
		transform-origin: 50% 50%;
		color: black;
		box-shadow: inset -0.1rem 0.1rem 0.03rem 0.1rem #ffffff99,
			inset 0.1rem -0.1rem 0.03rem 0.1rem #33333355;
	}
	.button:hover {
		scale: 1.05;
	}
	.button:active {
		scale: 0.95;
	}
	.button--small {
		font-size: 12px;
		padding: 10px 16px;
		gap: 10px;
	}
	.button--medium {
		font-size: 14px;
		padding: 9px 16px;
		gap: 9px;
	}
	.button--large {
		font-size: 16px;
		padding: 12px 24px;
		gap: 12px;
	}
	.button--colorless {
		background-color: #e8e8e8;
	}
	.button--white {
		background-color: #d8d5c9;
	}
	.button--blue {
		background-color: #afbfe8;
	}
	.button--black {
		background-color: #bfb6d2;
	}
	.button--red {
		background-color: #dea08e;
	}
	.button--green {
		background-color: #97ad9e;
	}
	.button--gold {
		background-color: #ecd993;
	}
	i {
		font-size: 1.3rem;
	}
</style>
