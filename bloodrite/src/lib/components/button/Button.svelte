<script lang="ts">
	export let label: string = '';
	export let set_symbol: string = '';
</script>

<svelte:head>
	<link href="//cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css" rel="stylesheet" type="text/css" />
</svelte:head>
<button type="button" class={$$props.class} on:click>
	{label}
	{#if set_symbol}<i class={`ss ss-${set_symbol}`} />{/if}
</button>

<style>
	i {
		font-size: 1.3rem;
	}
</style>
