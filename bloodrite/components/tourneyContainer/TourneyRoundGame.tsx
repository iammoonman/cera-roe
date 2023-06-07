import React from "react";
import { ZeroMana, OneMana, TwoMana } from "../symbols/symbols";
import PlayerLink from "../playerLink/Playerlink";
import { Match } from "../json/draft";

interface Props {
	playerNames: any;
	match: Match;
	isLoser?: boolean;
}

const TourneyRoundGame = (props: Props) => {
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
	return (
		<>
			<div className="scoreboardBlock" style={props.isLoser ? { background: "#a8a8a8" } : {}}>
				<ul className="scoreboardUl">
					{props.match.players.length > 0 ? (
						props.match.players.map((playerID: string | number, index: React.Key) => (
							<li className="scoreboardLi" key={index} style={props.isLoser ? { borderColor: "#00000099" } : {}}>
								<div className="scoreboardName">
									<PlayerLink player={{ name: props.playerNames[playerID], id: playerID }} />
								</div>
								<div className="scoreboardScore">{props.match.scores.filter((d) => d == index).length === 2 ? <TwoMana /> : props.match.scores.filter((d) => d == index).length === 1 ? <OneMana /> : props.match.players.find((u) => u == "None") || props.match.scores.length == 0 ? <>&nbsp;</> : <ZeroMana />}</div>
							</li>
						))
					) : (
						<>
							<li className="scoreboardLi" style={props.isLoser ? { borderColor: "#00000099" } : {}}>
								<div className="scoreboardName">&nbsp;</div>
							</li>
							<li className="scoreboardLi" style={props.isLoser ? { borderColor: "#00000099" } : {}}>
								<div className="scoreboardName">&nbsp;</div>
							</li>
						</>
					)}
				</ul>
			</div>
		</>
	);
};
export default TourneyRoundGame;
