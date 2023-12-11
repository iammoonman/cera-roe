<script lang="ts">
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
		background-color: var(--background, black);
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
