
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
	.tag-bump {
		position: absolute;
		border-radius: 0 0 15px 15px;
		background: var(--primary);
		display: grid;
		place-items: center;
		top: 0;
		right: 5%;
		padding-inline: 15px;
		height: 24px;
		--symbol-height: 25px;
	}
	.edit-bump {
		appearance: none;
		border: none;
		cursor: pointer;
		position: absolute;
		border-radius: 0 0 15px 15px;
		background: var(--primary);
		display: grid;
		place-items: center;
		top: 0px;
		right: 20%;
		padding-inline: 15px;
		height: 24px;
		--symbol-height: 20px;
		transform-origin: 50% 0;
		scale: 1;
		transition: scale 200ms ease-in-out, box-shadow 200ms ease-in-out;
	}
	.edit-bump:hover {
		scale: 1.1;
		box-shadow: 0 5px 3px 0 black;
	}
	.edit-bump:active {
		scale: 0.9;
	}
	.round-text {
		position: absolute;
		left: -23px;
		background-color: var(--primary);
		color: var(--secondary);
		border-radius: 0 50% 50% 0;
		width: 1.125rem;
		text-align: right;
		padding-right: 5px;
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
	.date-text::after,
	.stat-row::after,
	.table-row::after {
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
	.date-text:hover::after,
	.stat-row:hover::after,
	.table-row:hover::after {
		height: 50%;
	}
	.table {
		display: flex;
		flex-direction: column;
		justify-content: end;
		gap: 7.5px;
	}
	.table-row {
		z-index: 0;
		margin: 0;
		font-size: large;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		appearance: none;
		border: none;
		background-color: transparent;
		padding: 0;
		cursor: pointer;
		position: relative;
	}
	.bump-left {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 7.5px;
		padding: 15px;
		border-radius: 15px 0 0 15px;
		top: 7.5%;
		height: 80%;
		background-color: var(--background);
		right: 100%;
		width: 15rem;
		z-index: -2;
		box-shadow: 0px 4px 10px black;
		overflow: clip;
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
	.bump-right-stats {
		display: grid;
		grid-template-columns: 100%;
		font-size: smaller;
	}
	.bump-right-stats > div > span:nth-child(2n) {
		text-align: right;
	}
	.bump-right-stats > div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		position: relative;
	}
	.bump-right-picture {
		margin-top: auto;
	}
	.bump-right-rounds {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.round {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		gap: 15px;
		position: relative;
		max-height: 54px;
	}
	.m-result {
		font-size: 40px;
	}
	textarea {
		resize: none;
		height: 50%;
	}
</style>