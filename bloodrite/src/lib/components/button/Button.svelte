<script lang="ts">
	export let label: string = '';
	export let set_symbol: string = '';
</script>

<button type="button" class={$$props.class} on:click>
	{label}
	{#if set_symbol}<i class={`ss ss-${set_symbol}`} />{/if}
</button>

<style>
	i {
		font-size: 1.3rem;
		line-height: 0;
	}
	button {
		display: flex;
		align-items: center;
		gap: 1ch;
	}
</style>
