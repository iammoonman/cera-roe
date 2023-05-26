import React, {useContext} from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { PNContext } from '../../pages/_app'
import { Draft } from '../json/draft'
import PlayerLink from '../playerLink/Playerlink'

interface Props {
    draft: Draft,
    showExtras: boolean
}

const DraftTable = ({ draft, showExtras }: Props) => {
    // Pass final draft data into this component
    // Add an elo column if this is a ranked draft
    // Make this more responsive to the container it's in. good
    // Make each row a clickable button that launches the modal for that player's stats
    draft.players.sort(function compareFn(firstEl: { score: number; omp: number; gwp: number; ogp: number }, secondEl: { score: number; omp: number; gwp: number; ogp: number }) {
        //return firstEl.score==secondEl.score?(firstEl.omp==secondEl.omp?(firstEl.gwp==secondEl.gwp?firstEl.ogp<secondEl.ogp:firstEl.gwp<secondEl.gwp):firstEl.omp<secondEl.omp):firstEl.score < secondEl.score
        // Sort by score first
        // Then OMP
        // Then GWP
        // Then OGP
        if (firstEl.score === secondEl.score) {
            if (firstEl.omp === secondEl.omp) {
                if (firstEl.gwp === secondEl.gwp) {
                    if (firstEl.ogp === secondEl.ogp) {
                        return 0
                    } else if (firstEl.ogp < secondEl.ogp) {
                        return 1
                    } else {
                        return -1
                    }
                } else if (firstEl.gwp < secondEl.gwp) {
                    return 1
                } else {
                    return -1
                }
            } else if (firstEl.omp < secondEl.omp) {
                return 1
            } else {
                return -1
            }
        } else if (firstEl.score < secondEl.score) {
            return 1
        } else {
            return -1
        }
    })
    const context = useContext(PNContext)
    return (
        <>
            <table className="table table-hover" style={{ marginBottom: '0' }}>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Points</th>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Opponent Match-Win Percentage</Tooltip>}>
                            <th className={showExtras ? `d-none d-lg-table-cell` : 'd-none'} scope="col" style={{ textAlign: 'center' }}>OMP</th>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Game-Win Percentage</Tooltip>}>
                            <th className={showExtras ? `d-none d-lg-table-cell` : 'd-none'} scope="col" style={{ textAlign: 'center' }}>GWP</th>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Opponent Game-Win Percentage</Tooltip>}>
                            <th className={showExtras ? `d-none d-lg-table-cell` : 'd-none'} scope="col" style={{ textAlign: 'center' }}>OGP</th>
                        </OverlayTrigger>
                    </tr>
                </thead>
                <tbody>
                    {draft.players.map((player: { playerID: string | number; score: number; omp: number; gwp: number; ogp: number }, index: number) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td><PlayerLink player={{ name: context[player.playerID], id: player.playerID }} /></td>
                            <td style={{ textAlign: 'center' }}>{player.score}</td>
                            <td className={showExtras ? `d-none d-lg-table-cell` : 'd-none'} style={{ textAlign: 'center' }}>{player.omp.toFixed(2)}</td>
                            <td className={showExtras ? `d-none d-lg-table-cell` : 'd-none'} style={{ textAlign: 'center' }}>{player.gwp.toFixed(2)}</td>
                            <td className={showExtras ? `d-none d-lg-table-cell` : 'd-none'} style={{ textAlign: 'center' }}>{player.ogp.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
export default DraftTable;
