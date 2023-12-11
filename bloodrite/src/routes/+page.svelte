<script lang="ts">
	import { page } from '$app/stores';
	import EventScroller from '$lib/components/event-scroller/EventScroller.svelte';
	import MemberScroller from '$lib/components/member-scroller/MemberScroller.svelte';
</script>

<div class="auth">
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
		{/if}
		<span class="signedInText">
			<small>Signed in as</small>
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
		</span>
		<a href="/auth/signout" class="button">Sign out</a>
	{:else}
		<span class="notSignedInText" data-sveltekit-preload-data="off">You are not signed in</span>
		<a href="/auth/signin" data-sveltekit-preload-data="off">Sign In with Discord</a>
	{/if}
</div>
<div class="griddy">
	<div class="events">
		<EventScroller />
	</div>
	<div class="members">
		<MemberScroller />
	</div>
</div>

<style>
	.auth {
		height: 2rem;
		color: white;
	}
	.signedInText {
		white-space: nowrap;
	}
	.griddy {
		position: relative;
		flex: 1 1;
		--max-event-height: calc(100vh - 2rem);
		display: flex;
		justify-content: space-evenly;
	}
	.events {
		max-width: 100%;
		width: max-content;
	}
	.members {
		max-width: 50%;
		width: 50%;
	}
	@media (max-width: 800px) {
		.members {
			display: none;
		}
	}
</style>
