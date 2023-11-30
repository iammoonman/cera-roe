<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Auth, generateRandomString, makeHREF } from '$lib/stores/AuthStore';
	import { onMount } from 'svelte';

	Auth.subscribe((v) => {
		if (!browser) return;
		if (v.access_token === '') {
			let access_token = localStorage.getItem('access_token') ?? $page.url.href.match('(?<=access_token=)[^&]+')?.at(0) ?? generateRandomString();
			Auth.set({ access_token, href: makeHREF(access_token), user: undefined });
			localStorage.setItem('access_token', access_token);
		}
	});
	onMount(() => {
		fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `Bearer ${$Auth.access_token}`
			}
		})
			.then((r) => r.json())
			.then((r) => Auth.update((old) => ({ ...old, user: r })));
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@500&family=Righteous&family=Victor+Mono:wght@200&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div><slot /></div>

<style>
	div {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		overflow: clip;
		margin: -8px;
	}
	:global(.display-text) {
		font-family: 'Righteous', sans-serif;
		color: var(--text, white);
	}
	:global(.statistic-text) {
		font-family: 'Victor Mono', monospace;
		color: var(--text, white);
	}
	:global(.username-text) {
		font-family: 'Red Hat Display', sans-serif;
		color: var(--text, white);
	}
	:global(.subtitle-text) {
		font-family: 'Victor Mono', monospace;
		color: var(--subtitle, white);
	}
	:global(*) {
		--text: #e6e6e6;
		--subtitle: #bbbbbb;
		--background: #242424;
		--primary: #525252;
		--secondary: #e3e3e3;
		--accent: #bd1300;
	}
</style>
