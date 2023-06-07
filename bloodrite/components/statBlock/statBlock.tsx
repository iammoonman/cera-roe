import React from "react";
import { Stat } from "../json/player";
interface Props {
	stat: Stat;
}

const StatBlock = (props: Props) => {
	return (
		<div className="blockbg cardformatting aspect-square h-[140px] w-[140px]">
			<div className="flex items-center flex-col justify-between h-full">
				<div className="text-2xl">{props.stat.abbr}</div>
				<div className="text-6xl pr-px leading-[55px] font-mono">{props.stat.statn}</div>
				<div className="text-gray-500 text-[11px] text-center md:block">{props.stat.desc}</div>
			</div>
		</div>
	);
};
export default StatBlock;
