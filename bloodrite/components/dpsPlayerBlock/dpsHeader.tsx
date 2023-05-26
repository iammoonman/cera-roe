import Link from "next/link"
import React from "react"
import { DPS } from "../json/player"
import DPSHistoryGraph from "./dpsHistoryGraph"

interface Props {
    dps: DPS
}

export default class DPSHeader extends React.Component<Props> {
    render(): React.ReactNode {
        return (
            <div className="blockbg" style={{ 'textAlign': 'center'}}>
                <div style={{display:'flex', alignItems: 'center'}}>
                    <h1 style={{'color': 'black', flexGrow: 1}}>Draft Progression Series</h1>
                    <Link href={`/dps`}><a className="bumptag"><div className="tagsymbol"></div></a></Link>
                </div>
                <div className="d-flex" style={{ 'flexDirection': 'row', 'justifyContent': 'space-evenly' }}>
                    {this.props.dps.stats.map((d, i) => (
                        <div key={i} style={{color:'#727272'}}>{d[0]}: {d[1]}</div>
                    ))}
                    <div style={{color:'#727272'}}>Peak Elo : {Math.max(...this.props.dps.history.map(d=>d.new_elo)).toFixed(0)}</div>
                </div>
                <DPSHistoryGraph historyList={this.props.dps.history} />
            </div>
        )
    }
}