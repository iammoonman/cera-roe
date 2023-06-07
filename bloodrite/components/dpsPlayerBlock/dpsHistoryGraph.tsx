import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DPS } from "../json/player";

interface Props {
	historyList: DPS["history"];
}

const DPSHistoryGraph = (props: Props) => {
	//parse the string into a number for this
	return (
		<div style={{ marginRight: "4%", height: "300px" }}>
			<ResponsiveContainer width="100%" height={"100%"}>
				<LineChart data={props.historyList}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="draftID" type="number" interval={"preserveStartEnd"} domain={[0, 62]} label={{ value: "Draft #", position: "insideBottom", fill: "#727272" }} height={40} />
					<YAxis domain={[700, 1400]} tickCount={5} ticks={[600, 800, 1000, 1200, 1400]} label={{ value: "Elo Rating", angle: -90, position: "insideLeft", fill: "#727272", textAnchor: "middle" }} />
					<Tooltip content={<DPSToolTip active={undefined} payload={undefined} label={undefined} />} />
					<Line connectNulls type="monotone" dataKey="new_elo" stroke="#ad8238" name="Post Draft Elo" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};
export default DPSHistoryGraph;

const DPSToolTip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="blockbg">
				<div className="p-0">
					<div>{`New Elo : ${payload[0].value.toFixed(0)}`}</div>
					<div>{`Block : ${DPSNumbers(label)}`}</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

const DPSNumbers = (num: number) => {
	const DPSDraftList = [
		"Nonblock Cube",
		"Fourth Edition & Chronicles",
		"Ice Age Block",
		"Mirage Block",
		"Fifth Edition",
		"Tempest Block",
		"Urza's Block",
		"Sixth Edition",
		"Mercadian Masques Block",
		"Invasion Block",
		"Seventh Edition",
		"Odyssey Block",
		"Onslaught Block",
		"Eighth Edition",
		"Mirrodin Block",
		"Kamigawa block",
		"Ninth Edition",
		"Ravnica Block",
		"Coldsnap Block",
		"Time Spiral Block",
		"Tenth Edition",
		"Lorwyn Block",
		"Shadowmoor Block",
		"Alara Block",
		"Magic 2010",
		"Zendikar Block",
		"Rise of the Eldrazi",
		"Magic 2011",
		"Scars of Mirrodin Block",
		"Magic 2012",
		"Innistrad Block",
		"Avacyn Restored",
		"Magic 2013",
		"Return to Ravnica Block",
		"Magic 2014",
		"Theros Block",
		"Magic 2015",
		"Khans of Tarkir Block",
		"Dragons of Tarkir Block",
		"Magic Origins",
		"Battle for Zendikar Block",
		"Eldritch Moon Block",
		"Kaladesh Block",
		"Amonkhet Block",
		"Ixalan Block",
		"Dominaria",
		"Core Set 2019",
		"Guilds of Ravnica",
		"Ravnica Allegiance",
		"War of the Spark",
		"Core Set 2020",
		"Throne of Eldraine",
		"Theros: Beyond Death",
		"Ikoria: Lair of Behemoths",
		"Core Set 2021",
		"Zendikar Rising",
		"Kaldheim",
		"Strixhaven: School of Mages",
		"Adventures in the Forgotten Realms",
		"Midnight Hunt",
		"Crimson Vow",
		"Kamigawa: Neon Dynasty",
	];
	return DPSDraftList[num - 1];
};
