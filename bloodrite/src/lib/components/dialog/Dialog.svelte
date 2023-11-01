<script lang="ts">
	export let open: boolean = false;
	let dialog: HTMLDialogElement;
	$: {
		if (!dialog) break $;
		if (open) {
			dialog?.showModal();
		} else {
			dialog?.close();
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:cancel={() => {
		open = false;
	}}
	on:click|self={() => {
		open = false;
	}}
>
	<slot />
</dialog>

<style>
	dialog {
		border: none;
		padding: 0;
		overflow: visible;
		background-color: transparent;
	}
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(0.2rem);
	}
</style>
