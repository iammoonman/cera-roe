<script lang="ts">
	import type { DraftEvent } from '$lib/types/event';
	import Button from '../button/Button.svelte';
	import Dialog from '../dialog/Dialog.svelte';
	import DraftCard from '../draft-card/DraftCard.svelte';

	export let draft: DraftEvent;
	let open: boolean = false;
</script>

<Button label={draft.meta?.title} size="medium" set_symbol={draft.meta?.set_code} on:click={() => (open = true)} />

<Dialog bind:open>
	<DraftCard {draft} />
</Dialog>
