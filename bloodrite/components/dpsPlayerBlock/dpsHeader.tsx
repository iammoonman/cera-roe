import Link from "next/link";
import React from "react";
import { DPS } from "../json/player";
import DPSHistoryGraph from "./dpsHistoryGraph";
import { DPSSymbol } from "../symbols/symbols";

interface Props {
	dps: DPS;
}

const DPSHeader = (props: Props) => {
	return (
		<div className="blockbg text-center">
			<div className="flex items-center">
				<h1 className="text-black flex-grow text-xl">Draft Progression Series</h1>
				<Link href={`/dps`}>
					<a className="xl:-ml-16 h-8 w-8 grid place-items-center">
						<DPSSymbol />
					</a>
				</Link>
			</div>
			<div className="flex justify-evenly">
				{props.dps.stats.map((d, i) => (
					<div key={i} className="text-stone-400">
						{d[0]}: {d[1]}
					</div>
				))}
				<div className="text-stone-400">Peak Elo : {Math.max(...props.dps.history.map((d) => d.new_elo)).toFixed(0)}</div>
			</div>
			<DPSHistoryGraph historyList={props.dps.history} />
		</div>
	);
};
export default DPSHeader;
