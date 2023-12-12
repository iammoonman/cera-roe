<script lang="ts">
	import { page } from '$app/stores';
	import EventScroller from '$lib/components/event-scroller/EventScroller.svelte';
</script>

<div class="auth">
	<h2>The Rat Zone</h2>
	{#if $page.data.session}
		<p>
			{#if $page.data.session.user?.image}
				<img src={`${$page.data.session.user.image}`} alt="avatar"/>
			{/if}
			<span class="signedInText">
				<small>Signed in as</small>
				<strong>{$page.data.session.user?.name ?? 'User'}</strong>
			</span>
			<a href="/auth/signout" class="button">Sign out</a>
		</p>
	{:else}
		<p>
			<span class="notSignedInText" data-sveltekit-preload-data="off">You are not signed in</span>
			<a href="/auth/signin" data-sveltekit-preload-data="off">Sign in with Discord</a>
		</p>
	{/if}
</div>
<div class="griddy">
	<EventScroller />
</div>

<style>
	.auth {
		height: 4rem;
		color: white;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		gap: 15px;
	}
	.signedInText {
		white-space: nowrap;
	}
	img {
		height: 1.4em;
		width: 1.4em;
		border-radius: 50%;
		transform: translateY(25%);
	}
	.griddy {
		position: relative;
		flex: 1 1;
		--max-event-height: calc(100vh - 4rem);
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}
</style>
