import React from 'react'
import styles from './StatBlock.module.css'
import {Stat} from '../json/player'
interface Props {
    stat: Stat
}

export default class StatBlock extends React.Component<Props>  {
    render(): React.ReactNode {
        return (
            <div className={`${styles.aspectSquare} blockbg cardformatting`}>
                <div className="d-flex align-items-center flexyclass">
                    <div className={`${styles.titleadjust}`}>{ this.props.stat.abbr}</div>
                    <div className={`${styles.hugetext}`}>{this.props.stat.statn}</div>
                    {this.props.stat.desc ? <div className={`${styles.mutetext} cutoff d-none d-md-block`}>{this.props.stat.desc}</div> : ''}
                </div>
            </div>
        )
    }
}