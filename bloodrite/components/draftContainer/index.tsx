import React from "react";
import Link from "next/link";
import { Draft } from "../json/draft";
import DraftRoundGroup from "./DraftRoundGroup";
import DraftTable from "./DraftTable";
import { DPSSymbol, VPSSymbol } from "../symbols/symbols";

interface Props {
	showExtras: boolean;
	showRounds: boolean;
	draft: Draft;
}

const DraftContainer = (props: Props) => {
	// Takes options for whether to show certain components like DraftRoundGroup or DraftTable.
	// Calls the Discord API with token to get usernames from playerID
	// Or calls my JSON cache for usernames
	// Cut down playerNames to only the relevant players
	return (
		<>
			<div className="blockbg">
				<div className="flex justify-between mt-1" id={"Draft" + props.draft.draftID}>
					<h3 className="text-3xl">{props.draft.title}</h3>
					{props.draft.tag === "dps" ? (
						<Link href={`/dps`}>
							<a className="dpshover w-16 h-9">
								<DPSSymbol />
							</a>
						</Link>
					) : props.draft.tag === "vps" ? (
						<div className="w-24">
							<VPSSymbol />
						</div>
					) : (
						<></>
					)}
				</div>
				<h6>{new Date(props.draft.date).toDateString()}</h6>
				<h6 className="">{props.draft.description}</h6>
				{props.showRounds ? <DraftRoundGroup draft={props.draft} /> : <></>}
				<DraftTable draft={props.draft} showExtras={props.showExtras || false} />
			</div>
		</>
	);
};
export default DraftContainer;
