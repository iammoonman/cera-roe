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
		grid-template-columns: repeat(auto-fit, minmax(15%, 330px));
		position: relative;
		height: var(--max-event-height, 500px);
		overflow-x: clip;
		overflow: scroll;
		background-color: var(--background);
	}
</style>
