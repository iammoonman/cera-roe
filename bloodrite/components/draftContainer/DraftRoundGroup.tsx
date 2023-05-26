import { Tabs, Tab, Fade } from 'react-bootstrap'
import Masonry from 'react-masonry-css'
import React from 'react'
import { Draft, Round } from '../json/draft'
import DraftRoundGame from './DraftRoundGame'

interface Props {
    draft: Draft
}

export default class DraftRoundGroup extends React.Component<Props> {
    // Put into the history tab. Shows a carousel of the rounds in the draft.
    // Map to rounds
    // Map to matches
    // Make the matches slot into list-group-horizontals of two each, if able
    // Add the carousel controls for the carousel.
    render(): React.ReactNode {
        return (
            <>
                <Tabs>
                    {this.props.draft.rounds.map((round: Round, index: React.Key | number) => (
                        <Tab eventKey={`${index}`} title={`Round ${round.roundNUM}`} key={index}>
                            <Masonry breakpointCols={{ default: 2, 500: 1 }} className={`masonry-grid`}>
                                {round.matches.map((game: any, index2: React.Key) => (
                                    <DraftRoundGame match={game} key={index2} />
                                ))}
                            </Masonry>
                        </Tab>
                    ))}
                </Tabs>
            </>
        )
    }
}
