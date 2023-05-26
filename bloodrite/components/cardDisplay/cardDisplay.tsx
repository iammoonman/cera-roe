import React from 'react'
import { CardData } from '../json/player'

interface Props {
    cardInfo: CardData
}

export default class CardDisplay extends React.Component<Props> {
    render(): React.ReactNode {
        return (
            <img className="crd" src={this.props.cardInfo.imageuri} />
        )
    }
}