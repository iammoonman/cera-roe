import React, { useContext } from "react";
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import PlayerLink from "../components/playerLink/Playerlink";
import Drafts from "./api/draft/drafts.json";
import Players from "./api/player/players.json";
import EventScroller from "../components/eventScroller/EventScroller";
import { PNContext } from "./_app";
import { DPSSymbol } from "../components/symbols/symbols";

const TagPage = () => {
	const context = useContext(PNContext);
	const futuredrafts: any[] = [];
	const elochartdata = [
		...[17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map(function (q) {
			return {
				name: `${q * 50} - ${(q + 1) * 50}`,
				num: Players.filter((d) => d.dps?.elo < (q + 1) * 50 && d.dps?.elo > q * 50).length,
			};
		}),
	];
	const toprankdata = [...Players.sort((a, b) => (a.dps?.elo > b.dps?.elo ? -1 : a.dps?.elo < b.dps?.elo ? 1 : 0))].slice(0, 10);
	return (
		<div className="w-4/5 mx-auto">
			<div className="flex flex-wrap -mx-2 -mt-4 gap-1">
				<div className="w-full">
					<div className="blockbg">
						<div className="flex justify-between">
							<div className="titleh1">Draft Progression Series</div>
							<div className="tagsymbol cursor-pointer h-11"></div>
						</div>
						<p>Sat Jan 8 2021 - Sat Mar 26 2022</p>
						<p>The Draft Progression Series, or DPS, is a collection of sequential draft events wherein we draft every draftable block of Magic from start to finish. The drafts are hosted every Saturday at around 7PM CST and have an associated elo rating. Each block is played only once, and the series follows the retail draft experiences available for the block if able.</p>
						<p>This event has ended. Thank you for playing.</p>
					</div>
				</div>
				<div className="flex-grow max-w-[50%]">
					<div className="blockbg" style={{ height: "500px" }}>
						<h4 className="ml-auto mr-auto w-max text-3xl">Top Players</h4>
						<table className="w-full mb-0">
							<thead>
								<tr className="border-b-2">
									<th scope="col" className="p-1 text-left">#</th>
									<th scope="col" className="p-1 text-left">Name</th>
									<th scope="col" className="p-1 text-left">ELO</th>
								</tr>
							</thead>
							<tbody>
								{toprankdata.map((d, i) => (
									<tr key={i} className="h-9 hover:bg-opacity-40 hover:bg-gray-300">
										<td className="p-1 w-16" style={i === 0 ? { fill: "orangered" } : i < 3 ? { fill: "goldenrod" } : i < 6 ? { fill: "silver" } : {}}>
											<DPSSymbol />
										</td>
										<td className="align-middle p-1">
											<PlayerLink player={{ name: context[d.playerID], id: d.playerID }} />
										</td>
										<td className="align-middle p-1">{d.dps?.elo.toFixed(0)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className="flex-grow max-w-[50%]">
					<div className="blockbg h-[500px]" style={{ height: "500px" }}>
						<h4 className="ml-auto mr-auto w-max text-3xl">Elo Ratings Histogram</h4>
						<ResponsiveContainer>
							<BarChart data={elochartdata} height={500} margin={{ top: 5, right: 27, bottom: 37, left: -32 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" angle={-15} minTickGap={9} tickMargin={7} />
								<YAxis />
								<Tooltip />
								<Bar dataKey="num" name="Count" fill="black" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
				{/* <div className={`col-xl-12`}>
                        <div>
                            <h4 style={{ marginLeft: 'auto', marginRight: 'auto', width: 'max-content' }}>Upcoming Events</h4>
                            <table className={`table table-hover`}>
                                <thead>
                                    <th style={{ width: '80%' }}>Block</th>
                                    <th>Date</th>
                                </thead>
                                <tbody>
                                    {this.futuredrafts.map((d, i) =>
                                        <tr key={i}>
                                            <td>{d.name}</td>
                                            <td>{d.date.toDateString()}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div> */}
				<div className="w-full">
					<EventScroller drfts={Drafts.filter((d) => d.tag === "dps")} />
				</div>
			</div>
		</div>
	);
};

export default TagPage;
