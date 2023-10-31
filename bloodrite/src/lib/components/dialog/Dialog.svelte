<script lang="ts">
	export let open: boolean = false;
	let dialog: HTMLDialogElement;
	$: {
		if (open) {
			dialog?.showModal();
		} else if (open === false) {
			dialog?.close();
		}
	}
</script>

<svelte:window
	on:click={(event) => {
		if (event.target === dialog) {
			dialog.close();
			open = false;
		}
	}}
/>

<dialog bind:this={dialog}>
	<slot />
</dialog>

<style>
	dialog {
		background: transparent;
		border: none;
	}
</style>
