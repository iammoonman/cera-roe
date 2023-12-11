<script lang="ts">
	import { member_access_list } from '$lib/stores/MemberStore';
	import PlayerButton from '../player-button/PlayerButton.svelte';
</script>

<div class="scroll-root">
	{#each $member_access_list as m}
		<PlayerButton user_id={m.id} />
	{/each}
</div>

<style>
	.scroll-root {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 330px), 1fr));
		position: relative;
		height: var(--max-event-height, 500px);
		overflow: scroll;
		overflow-x: clip;
		background-color: var(--background);
	}
</style>
