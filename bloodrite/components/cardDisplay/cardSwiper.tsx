import { useState } from 'react'
import CardDisplay from './cardDisplay'
import React from 'react'
import { CardData } from '../json/player'
import BlockContainer from '../blockContainer/BlockContainer'
import styles from './CardSwiper.module.css';
interface Props {
    cardsList: CardData[]
}

interface State {
    focusedElementIndex: number
}

export default class CardSwiper extends React.Component<Props, State> {

    checkClicked(e) {
        this.setState({ focusedElementIndex: e })
    }
    constructor(props) {
        super(props)
        this.state = { focusedElementIndex: ~~(this.props.cardsList.length / 2) }
    }
    render(): React.ReactNode {
        return (
            <div className={`blockbg px-2 ${styles.cardcontainer}`}>
                <div className="cardstack">
                    {this.props.cardsList.map((d, i) => {
                        return (
                            <div className="cardblock" style={{
                                transform: 'translate(' + (20 * (i - this.state.focusedElementIndex)) +
                                    '%) scale(' + ((1 - Math.abs(((i - this.state.focusedElementIndex) / (7)))) > 0.5 ? (1 - Math.abs(((i - this.state.focusedElementIndex) / (7)))) : 0) +
                                    ') rotate(' + ((Math.abs(i - this.state.focusedElementIndex) > 6 ? Math.sign(i - this.state.focusedElementIndex) * 6 : (i - this.state.focusedElementIndex)) * 10) + 'deg)',
                                zIndex: '' + (14 - Math.abs(this.state.focusedElementIndex - i)) + ''
                            }} key={i} onClick={() => this.checkClicked(i)}>
                                <CardDisplay cardInfo={d} />
                            </div>
                        )
                    })}
                </div>
                <div className={`${styles.explainstack}`}>
                    <h1 className={`${styles.h1hugename}`} style={{fontSize:'32px'}}>{this.props.cardsList[this.state.focusedElementIndex].name}</h1>
                    <div className={`${styles.subtext}`}>{this.props.cardsList[this.state.focusedElementIndex].tooltip}</div>
                </div>
            </div>
        )
    }
}