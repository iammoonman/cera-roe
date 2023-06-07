import React, { useState } from "react";
import { Draft, Round } from "../json/draft";
import DraftRoundGame from "./DraftRoundGame";

interface Props {
	draft: Draft;
}

const DraftRoundGroup = (props: Props) => {
	const [selectedRound, setSelectedRound] = useState<number>(0);
	return (
		<div className="flex flex-col gap-1">
			<div className="flex flex-nowrap justify-around gap-2">
				{props.draft.rounds.map((r, i) => (
					<button onClick={() => setSelectedRound(i)} className="px-4 py-2 flex-grow font-semibold text-sm bg-gray-300 hover:bg-gray-400 rounded-md shadow-sm">
						Round: {r.roundNUM}
					</button>
				))}
			</div>
			{props.draft.rounds.map(
				(round: Round, index) =>
					selectedRound === index && (
						<div className="grid grid-cols-1 lg:grid-cols-2">
							{round.matches.map((game: any, index2: React.Key) => (
								<DraftRoundGame match={game} key={index2} />
							))}
						</div>
					)
			)}
		</div>
	);
};
export default DraftRoundGroup;
