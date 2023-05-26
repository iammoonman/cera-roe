import React from 'react';
import BlockContainer from '../blockContainer/BlockContainer';
import Link from 'next/link';
import { Draft } from '../json/draft';
import DraftRoundGroup from './DraftRoundGroup';
import DraftTable from './DraftTable';
import { DPSSymbol, VPSSymbol } from '../symbols/symbols';

interface Props {
    showExtras: boolean;
    showRounds: any;
    draft: Draft;
}

export default class DraftContainer extends React.Component<Props> {
    // Takes options for whether to show certain components like DraftRoundGroup or DraftTable.
    // Calls the Discord API with token to get usernames from playerID
    // Or calls my JSON cache for usernames
    // Cut down playerNames to only the relevant players
    render() {
        return (
            <>
                <BlockContainer>
                    <div className="d-flex" style={{ 'justifyContent': 'space-between', 'marginTop': '0.5%' }} id={"Draft" + this.props.draft.draftID}>
                        <h3>{this.props.draft.title}</h3>
                        {this.props.draft.tag === "dps" ? <Link href={`/dps`}><a className="dpshover" style={{ height: '36px', width: '67px' }}><DPSSymbol /></a></Link> : (this.props.draft.tag === "vps" ? <div style={{ width: '100px' }}><VPSSymbol /></div> : <></>)}
                    </div>
                    <h6>{new Date(this.props.draft.date).toDateString()}</h6>
                    <h6 className={this.props.showExtras ? "description-cutoff" : 'description-cutoff d-none'}>{this.props.draft.description}</h6>
                    {this.props.showRounds ? <DraftRoundGroup draft={this.props.draft} /> : <></>}
                    <DraftTable draft={this.props.draft} showExtras={this.props.showExtras || false} />
                </BlockContainer>
            </>
        )
    }
}
