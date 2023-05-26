import React from "react";
import { ReactNode } from "react";
import ReactFlow, { Controls, Edge, Handle, isEdge, isNode, MiniMap, Node, PanOnScrollMode, Position } from "react-flow-renderer";
import BlockContainer from "../blockContainer/BlockContainer";
import Link from 'next/link';
import PlayerNames from '../json/playerNames.json'
import { EventPlayer, Tourney } from "../json/draft";
import { makeLayout } from "./layout";
import TourneyRoundGame from "./TourneyRoundGame";
import PlayerLink from "../playerLink/Playerlink";



interface Props {
    tournament: Tourney
}

export default class TourneyContainer extends React.Component<Props> {
    render(): ReactNode {
        var edges: Edge[] = []
        var nodes: Node[] = this.props.tournament.nodes.map((d, i, a) => {
            edges.push(
                ...d.feeds.reduce((v: Edge[], q) => {
                    // If the edge feeds from a winner into a loser, it shouldn't appear.
                    var feedsLoser = this.props.tournament.nodes.filter((y) => { return (y.loser && q == y.bnid) }).length
                    //console.log(isLoser)
                    if (!(!d.loser && feedsLoser)) {
                        v.push({
                            id: `e${d.bnid}-${q}`,
                            type: 'smoothstep',
                            source: `${d.bnid}`,
                            target: `${q}`,
                            style: { strokeWidth: '5px', stroke: '#000000' }
                        })
                    }
                    return v
                }, [])
            )
            return {
                id: `${d.bnid}`,
                data: {
                    match: d.match,
                    sp: d.feeds.length ? Position.Right : false,
                    tp: d.round ? Position.Left : false,
                    loser: d.loser
                },
                draggable: false,
                connectable: false,
                type: 'match',
                position: {
                    x: 0,
                    y: 0
                }
            }
        }
        )
        let uselessvar: (Node | Edge)[] = []
        const dip: Node[] = makeLayout(uselessvar.concat(edges, nodes), 0)
        const day = new Date(this.props.tournament.date)
        return (
            <>
                <BlockContainer styles={{ height: '850px', display: 'flex', flexDirection: 'column' }}>
                    <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                        <h4>{this.props.tournament.title}</h4>
                        {this.props.tournament.tag == 'dps' ? <Link href={`/dps`}><a><div className="tagsymbol"></div></a></Link> : <></>}
                    </div>
                    <h6>{day.toDateString()}</h6>
                    <div style={{ height: '250px', overflowY: 'scroll' }}>
                        <table className="table table-hover" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ position: 'sticky', top: '0', background: '#EFEDED', boxShadow: '-1px 0px 0px 1px black' }}>
                                    <th scope="col">Rank</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Seed</th>
                                    <th scope="col" className={`score`}>Wins</th>
                                    <th scope="col" className={`score`}>Losses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.tournament.players.sort((a, b) => {
                                    return a.rank == b.rank ? (a.seed > b.seed ? 1 : -1) : (a.rank < b.rank ? -1 : 1)
                                }).map((pl: EventPlayer, index) =>
                                    <tr className={`playerRow`} key={index}>
                                        <td>{pl.rank}</td>
                                        <td><PlayerLink player={{ name: PlayerNames[pl.playerID], id: pl.playerID }} /></td>
                                        <td>{pl.seed}</td>
                                        <td>{pl.wins}</td>
                                        <td>{pl.losses}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ flexGrow: '1' }}>
                        <ReactFlow nodes={dip} edges={edges} nodeTypes={{ match: MatchNode }} fitView fitViewOptions={{ padding: 0.25 }} minZoom={0.1}>
                            <Controls />
                            <MiniMap nodeColor={(n) => n.data.loser ? 'grey' : '#C39647'} maskColor={'#00000033'} />
                        </ReactFlow>
                    </div>
                </BlockContainer>
            </>
        )
    }
}

const MatchNode = (data: Node) => {
    return (
        <>
            {data.data.tp ? <Handle type={"target"} position={data.data.tp} isConnectable={false} style={{ top: '75%', borderColor: 'transparent', background: 'transparent', transform: 'translateX(5px)' }} /> : <></>}
            <div style={{ height: '44px', width: '400px' }}>
                <TourneyRoundGame playerNames={PlayerNames} match={data.data.match ?? { players: [], scores: [] }} isLoser={data.data.loser} />
            </div>
            {data.data.sp ? <Handle type={"source"} position={data.data.sp} isConnectable={false} style={{ top: '75%', borderColor: 'transparent', background: 'transparent', transform: 'translateX(-5px)' }} /> : <></>}
        </>
    )
}

