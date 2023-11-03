<script lang="ts">
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let label: string = '';
	export let set_symbol: string = 'mor';
</script>

<svelte:head>
	<link href="//cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css" rel="stylesheet" type="text/css" />
</svelte:head>
<button type="button" class={`button button--${size}`} on:click>
	{label}
	{#if set_symbol}<i class={`ss ss-${set_symbol}`} />{/if}
</button>

<style>
	.button {
		font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
		background: var(--button-bg, #e8e8e8);
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
		color: var(--button-text, black);
		box-shadow: inset -0.1rem 0.1rem 0.03rem 0.1rem #ffffff99, inset 0.1rem -0.1rem 0.03rem 0.1rem #33333355;
	}
	.button:hover {
		scale: 1.05;
		background: var(--button-hover-bg, #eeeeee);
	}
	.button:active {
		scale: 0.95;
		background: var(--button-active-bg, #dddddd);
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
	i {
		font-size: 1.3rem;
	}
</style>
