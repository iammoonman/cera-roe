import React, { useContext } from "react";
import { ZeroMana, OneMana, TwoMana } from "../symbols/symbols";
import PlayerLink from "../playerLink/Playerlink";
import { Match } from "../json/draft";
import { PNContext } from "../../pages/_app";

interface Props {
	match: Match;
	isLoser?: boolean;
}

const DraftRoundGame = (props: Props) => {
	// Pass games from one draft into this component.
	// Generalize later for Bo5 and Bo1
	// Replace UP DN XX with nice icons
	// "game" = {
	//     "players": ["playerID_A","playerID_B"],
	//     "gamewinner": ["playerID_A","playerID_A"]
	// }
	// Make a call to the draft to get this player's name
	// Would be cool to have the middle bar with arrows or something to show which player won which games, but it needs a design for multiplayer.
	// Add a catch for games that didn't track who won which games in the match.
	const context = useContext(PNContext);
	return (
		<div className="scoreboardBlock rounded-2xl relative mb-px" style={props.isLoser ? { background: "#a8a8a8" } : {}}>
			<ul className="my-0 p-0">
				{props.match.players.map((playerID: string | number, index: React.Key) => (
					<li className="scoreboardLi flex border-solid px-1 max-h-8 justify-between" key={index}>
						<div className="scoreboardName text-trick font-bold pl-1 text-lg align-bottom">
							<PlayerLink player={{ name: context[playerID], id: playerID }} />
						</div>
						<div className="scoreboardScore flex justify-end w-min p-0.5">{props.match.scores[index] === 2 ? <TwoMana /> : props.match.scores[index] === 1 ? <OneMana /> : <ZeroMana />}</div>
					</li>
				))}
			</ul>
		</div>
	);
};
export default DraftRoundGame;
