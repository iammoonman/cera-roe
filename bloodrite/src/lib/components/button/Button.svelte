<script lang="ts">
	export let label: string = '';
	export let set_symbol: string = 'mor';
</script>

<svelte:head>
	<link href="//cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css" rel="stylesheet" type="text/css" />
</svelte:head>
<button type="button" class="button username-text" on:click>
	{label}
	{#if set_symbol}<i class={`ss ss-${set_symbol}`} />{/if}
</button>

<style>
	.button {
		width: fit-content;
		white-space: nowrap;
		background-color: inherit;
		border: 0;
		border-radius: 2px;
		cursor: pointer;
		display: flex;
		gap: 5px;
		padding: 7.5px 15px;
		align-items: center;
		transition: scale 50ms ease-in-out, box-shadow 50ms ease-in-out;
		perspective: 100px;
		transform-origin: 50% 50%;
	}
	.button:hover {
		scale: 1.07;
		box-shadow: 0 2.5px 5px black;
		/* , inset 0 -20px 0 -15px var(--accent); */
	}
	.button:active {
		scale: 0.95;
		box-shadow: unset;
	}
	i {
		font-size: 1.3rem;
	}
</style>
