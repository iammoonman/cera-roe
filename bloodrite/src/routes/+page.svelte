<script lang="ts">
	import { page } from '$app/stores';
	import Dialog from '$lib/components/dialog/Dialog.svelte';
	import EventScroller from '$lib/components/event-scroller/EventScroller.svelte';
	import PlayerCard from '$lib/components/player-card/PlayerCard.svelte';
	import { getByName } from '$lib/stores/MemberStore';
	let searchtext: string = '';
	$: search_users = getByName(searchtext);
	let selected_user: string | undefined;
	let open = false;
	$: {
		if (open === false) {
			selected_user = undefined;
			searchtext = '';
		}
	}
</script>

<header>
	<h2>The Rat Zone</h2>
	{#if $page.data.session}
		<p>
			{#if $page.data.session.user?.image}
				<img src={`${$page.data.session.user.image}`} alt="avatar" />
			{/if}
			<span class="signedInText">
				<small>Signed in as</small>
				<strong>{$page.data.session.user?.name ?? 'User'}</strong>
			</span>
			<a href="/auth/signout" class="button">Sign out</a>
		</p>
	{:else}
		<p>
			<span class="notSignedInText" data-sveltekit-preload-data="off">You are not signed in.</span>
			<a href="/auth/signin" data-sveltekit-preload-data="off">Sign in with Discord</a>
		</p>
	{/if}
	<input
		type="search"
		autocomplete="username"
		class="search-bar"
		bind:value={searchtext}
		list="user-list"
		placeholder="Search for a username..."
		on:keypress={(e) => {
			if (e.key === 'Enter' && search_users.length !== 0) {
				selected_user = search_users[0].id;
				open = true;
			}
		}}
	/>
	<datalist id="user-list">
		{#each search_users as u}
			<option value={u.name} />
		{/each}
	</datalist>
	<Dialog bind:open>
		{#if selected_user}
			<PlayerCard user_id={selected_user} />
		{/if}
	</Dialog>
</header>
<main>
	<EventScroller />
</main>
<style>
	.signedInText {
		white-space: nowrap;
	}
	img {
		height: 1.4em;
		width: 1.4em;
		border-radius: 50%;
		transform: translateY(25%);
	}
</style>
