import React, { useContext } from "react";
import Players from "../../pages/api/player/players.json";
import PlayerLink from "../playerLink/Playerlink";
import { PNContext } from "../../pages/_app";
const PlayerList = () => {
	// static contextType?: React.Context<any> | undefined = PNContext;
	const context = useContext(PNContext);
	return (
		<>
			<div className="blockbg">
				<h4 className="mx-auto text-3xl text-center">Players</h4>
				<div style={{ overflowY: "scroll", maxHeight: "400px" }}>
					<div className="grid grid-cols-1">
						<div>
							<div className="w-full border-b-2 sticky top-0 bg-[#EFEDED] h-9 p-2 items-center">Name</div>
							{Players.filter((d) => context[d.playerID] ?? false)
								.sort((a, b) => (context[a.playerID] < context[b.playerID] ? -1 : context[a.playerID] > context[b.playerID] ? 1 : 0))
								.map((d, i) => (
									<div key={i} className="w-full flex h-9 p-2 items-center hover:bg-opacity-40 hover:bg-gray-300">
										<PlayerLink player={{ id: d.playerID, name: context[d.playerID] }} />
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default PlayerList;
