import React, { useContext } from 'react';
import { ZeroMana, OneMana, TwoMana } from '../symbols/symbols';
import PlayerLink from '../playerLink/Playerlink';
import { Match } from '../json/draft';
import { PNContext } from '../../pages/_app';

interface Props {
    match: Match;
    isLoser?: boolean
}

export default class DraftRoundGame extends React.Component<Props> {
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
    static contextType?: React.Context<any> | undefined = PNContext;
    render() {
        return (
            <>
                <div className={`scoreboardBlock`} style={this.props.isLoser ? { background: '#a8a8a8' } : {}}>
                    <ul className={`scoreboardUl`}>
                        {this.props.match.players.map((playerID: string | number, index: React.Key) => (
                            <li className="scoreboardLi" key={index}>
                                <div className={`scoreboardName`}><PlayerLink player={{ name: this.context[playerID], id: playerID }} /></div>
                                <div className={`scoreboardScore`}>
                                    {this.props.match.scores[index] === 2 ? <TwoMana /> : (this.props.match.scores[index] === 1 ? <OneMana /> : <ZeroMana />)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        )
    }
}