import React, { useContext } from "react";
import { ReactNode } from "react";
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import BlockContainer from "../components/blockContainer/BlockContainer";
import PlayerLink from "../components/playerLink/Playerlink";
import Drafts from "./api/draft/drafts.json";
import Players from "./api/player/players.json";
import { Player } from "../components/json/player";
import EventScroller from "../components/eventScroller/EventScroller";
import { PNContext } from "./_app";
import { DPSSymbol } from "../components/symbols/symbols";

interface Props {}

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
	const toprankdata = [...Players.sort((a, b) => (a.dps?.elo > b.dps?.elo ? -1 : a.dps?.elo < b.dps?.elo ? 1 : 0))].slice(0, 8);
	return (
		<div className={`container`}>
			<div className={`row`}>
				<div className={`col-xl-12`}>
					<BlockContainer>
						<div className="d-flex" style={{ justifyContent: "space-between" }}>
							<div className="titleh1">Draft Progression Series</div>
							<div className="tagsymbol" style={{ height: "45px", cursor: "pointer" }}></div>
						</div>
						<p>Sat Jan 8 2021 - Sat Mar 26 2022</p>
						<p>The Draft Progression Series, or DPS, is a collection of sequential draft events wherein we draft every draftable block of Magic from start to finish. The drafts are hosted every Saturday at around 7PM CST and have an associated elo rating. Each block is played only once, and the series follows the retail draft experiences available for the block if able.</p>
						<p>This event has officially ended. Thank you for playing.</p>
					</BlockContainer>
				</div>
				<div className={`col-xl-6`}>
					<BlockContainer styles={{ height: "500px" }}>
						<h4 style={{ marginLeft: "auto", marginRight: "auto", width: "max-content" }}>Top Players</h4>
						<table className={`table table-hover`}>
							<thead>
								<tr>
									<th style={{ width: "30px" }}>#</th>
									<th>Name</th>
									<th>ELO</th>
								</tr>
							</thead>
							<tbody>
								{toprankdata.map((d, i) => (
									<tr key={i}>
										<td style={i === 0 ? { fill: "orangered", width: "67px" } : i < 3 ? { fill: "goldenrod" } : i < 6 ? { fill: "silver" } : {}}>
											<DPSSymbol />
										</td>
										<td style={{ verticalAlign: "middle" }}>
											<PlayerLink player={{ name: context[d.playerID], id: d.playerID }} />
										</td>
										<td style={{ verticalAlign: "middle" }}>{d.dps?.elo.toFixed(0)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</BlockContainer>
				</div>
				<div className={`col-xl-6`}>
					<div className="blockbg" style={{ height: "500px" }}>
						<h4 style={{ marginLeft: "auto", marginRight: "auto", width: "max-content" }}>Elo Ratings Histogram</h4>
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
                        <BlockContainer>
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
                        </BlockContainer>
                    </div> */}
				<div className={`col-xl-12`}>
					<EventScroller drfts={Drafts.filter((d) => d.tag === "dps")} />
				</div>
			</div>
		</div>
	);
};

export default TagPage;
