import React from "react";
import BlockContainer from "../blockContainer/BlockContainer";
import Players from '../../pages/api/player/players.json'
import PlayerLink from "../playerLink/Playerlink";
import { PNContext } from "../../pages/_app";
export default class PlayerList extends React.Component {
    static contextType?: React.Context<any> | undefined = PNContext;
    render(): React.ReactNode {
        return (
            <>
                <BlockContainer>
                    <h4 style={{ marginLeft: 'auto', marginRight: 'auto', width: 'max-content' }}>Players</h4>
                    <table style={{ width: "100%" }}>
                        <thead style={{ borderBottom: '2px solid black' }}>
                            <th style={{ width: '70%' }}>Name</th>
                        </thead>
                    </table>
                    <div style={{ overflowY: 'scroll', maxHeight: '400px' }}>
                        <table className={`table table-hover`}>
                            <tbody>
                                {Players.filter((d) => (this.context[d.playerID] ?? false)).sort((a, b) => (this.context[a.playerID] < this.context[b.playerID] ? -1 : (this.context[a.playerID] > this.context[b.playerID] ? 1 : 0))).map((d, i) =>
                                    <tr key={i}>
                                        <td><PlayerLink player={{ id: d.playerID, name: this.context[d.playerID] }} /></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </BlockContainer>
            </>
        )
    }
}