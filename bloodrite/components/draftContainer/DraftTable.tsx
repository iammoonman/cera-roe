import React, { useContext } from "react";
import { PNContext } from "../../pages/_app";
import { Draft } from "../json/draft";
import PlayerLink from "../playerLink/Playerlink";

interface Props {
	draft: Draft;
	showExtras: boolean;
}

const DraftTable = ({ draft, showExtras }: Props) => {
	// Pass final draft data into this component
	// Add an elo column if this is a ranked draft
	// Make this more responsive to the container it's in. good
	// Make each row a clickable button that launches the modal for that player's stats
	draft.players.sort((firstEl: { score: number; omp: number; gwp: number; ogp: number }, secondEl: { score: number; omp: number; gwp: number; ogp: number }) => {
		//return firstEl.score==secondEl.score?(firstEl.omp==secondEl.omp?(firstEl.gwp==secondEl.gwp?firstEl.ogp<secondEl.ogp:firstEl.gwp<secondEl.gwp):firstEl.omp<secondEl.omp):firstEl.score < secondEl.score
		// Sort by score first
		// Then OMP
		// Then GWP
		// Then OGP
		if (firstEl.score === secondEl.score) {
			if (firstEl.omp === secondEl.omp) {
				if (firstEl.gwp === secondEl.gwp) {
					if (firstEl.ogp === secondEl.ogp) {
						return 0;
					} else if (firstEl.ogp < secondEl.ogp) {
						return 1;
					} else {
						return -1;
					}
				} else if (firstEl.gwp < secondEl.gwp) {
					return 1;
				} else {
					return -1;
				}
			} else if (firstEl.omp < secondEl.omp) {
				return 1;
			} else {
				return -1;
			}
		} else if (firstEl.score < secondEl.score) {
			return 1;
		} else {
			return -1;
		}
	});
	const playerContext = useContext(PNContext);
	return (
		<table className="w-full mb-0">
			<thead>
				<tr className="border-b-2">
					<th scope="col" className="p-1 text-left">
						#
					</th>
					<th scope="col" className="p-1 text-left">
						Name
					</th>
					<th scope="col" className="text-center p-1">
						Points
					</th>
					<th className={showExtras ? `d-none d-lg-table-cell text-center p-1` : "d-none"} scope="col" title="Opponent Match-Win Percentage">
						OMP
					</th>
					<th className={showExtras ? `d-none d-lg-table-cell text-center p-1` : "d-none"} scope="col" title="Game-Win Percentage">
						GWP
					</th>
					<th className={showExtras ? `d-none d-lg-table-cell text-center p-1` : "d-none"} scope="col" title="Opponent Game-Win Percentage">
						OGP
					</th>
				</tr>
			</thead>
			<tbody>
				{draft.players.map((player: { playerID: string | number; score: number; omp: number; gwp: number; ogp: number }, index: number) => (
					<tr key={index} className="h-9 hover:bg-opacity-40 hover:bg-gray-300">
						<th scope="row" className="p-1 text-left">
							{index + 1}
						</th>
						<td className="p-1 text-left">
							<PlayerLink player={{ name: playerContext[player.playerID], id: player.playerID }} />
						</td>
						<td className="text-center p-1">{player.score}</td>
						<td className={showExtras ? `d-none d-lg-table-cell text-center p-1` : "d-none"}>{player.omp.toFixed(2)}</td>
						<td className={showExtras ? `d-none d-lg-table-cell text-center p-1` : "d-none"}>{player.gwp.toFixed(2)}</td>
						<td className={showExtras ? `d-none d-lg-table-cell text-center p-1` : "d-none"}>{player.ogp.toFixed(2)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
export default DraftTable;
