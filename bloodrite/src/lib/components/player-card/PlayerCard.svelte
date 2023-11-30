<div class="container">
	<div>
		<h1 class="display-text">name</h1>
		<p class="statistic-text date-text">P</p>
		<div class="description-text subtitle-text">H</div>
	</div>
	<div class="bump-right">
		<div class="bump-right-heading display-text">N</div>
	</div>
</div>

<style>
	.container {
		background: var(--background);
		padding: 15px;
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto auto;
		gap: 5px;
		position: relative;
		height: 35rem;
		width: 25rem;
		border-radius: 15px;
	}
	.container::before {
		border-radius: 15px;
		position: absolute;
		background-color: transparent;
		height: 100%;
		width: 100%;
		content: '';
		box-shadow: 0px 5px 15px black;
		z-index: -1;
	}
	.display-text {
		margin: 0;
		font-size: 3.4em;
	}
	.description-text {
		max-height: 50%;
	}
	.date-text {
		margin: 0;
		font-size: small;
		white-space: nowrap;
		position: relative;
		z-index: 0;
	}
	.date-text::after {
		position: absolute;
		bottom: 0;
		left: -15px;
		width: calc(100% + 30px);
		height: 0px;
		content: '';
		background-color: var(--accent);
		opacity: 0.75;
		transform-origin: 50% 100%;
		transition: height 200ms ease-in-out;
		z-index: -1;
	}
	.date-text:hover::after {
		height: 50%;
	}

	.bump-right {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 7.5px;
		padding: 15px;
		border-radius: 0 15px 15px 0;
		top: 7.5%;
		height: 80%;
		background-color: var(--background);
		left: 100%;
		width: 15rem;
		z-index: -2;
		box-shadow: 0px 4px 10px black;
		overflow: clip;
	}
	.bump-right-heading {
		height: 80px;
	}
</style>
