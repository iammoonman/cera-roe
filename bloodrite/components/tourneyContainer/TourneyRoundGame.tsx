import React from 'react';
import { ZeroMana, OneMana, TwoMana } from '../symbols/symbols';
import PlayerLink from '../playerLink/Playerlink';
import { Match } from '../json/draft';

interface Props {
    playerNames: any;
    match: Match;
    isLoser?: boolean
}

export default class TourneyRoundGame extends React.Component<Props> {
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
    render() {
        return (
            <>
                <div className={`scoreboardBlock`} style={this.props.isLoser ? { background: '#a8a8a8' } : {}}>
                    <ul className={`scoreboardUl`}>
                        {this.props.match.players.length > 0 ? this.props.match.players.map((playerID: string | number, index: React.Key) => (
                            <li className="scoreboardLi" key={index} style={this.props.isLoser ? { borderColor: '#00000099' } : {}}>
                                <div className={`scoreboardName`}>
                                    <PlayerLink player={{ name: this.props.playerNames[playerID], id: playerID }} />
                                </div>
                                <div className={`scoreboardScore`}>
                                    {this.props.match.scores.filter(d => d == index).length === 2 ? <TwoMana /> : (this.props.match.scores.filter(d => d == index).length === 1 ? <OneMana /> : (this.props.match.players.find(u => u == "None") || this.props.match.scores.length == 0 ? <>&nbsp;</> : <ZeroMana />))}
                                </div>
                            </li>
                        )) : <>
                            <li className="scoreboardLi" style={this.props.isLoser ? { borderColor: '#00000099' } : {}}>
                                <div className="scoreboardName">&nbsp;</div>
                            </li>
                            <li className="scoreboardLi" style={this.props.isLoser ? { borderColor: '#00000099' } : {}}>
                                <div className="scoreboardName">&nbsp;</div>
                            </li>
                        </>}
                    </ul>
                </div>
            </>
        )
    }
}
