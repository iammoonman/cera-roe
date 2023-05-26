import React, { ReactElement } from 'react'
import PlayerNames from '../../components/json/playerNames.json'
import CardSwiper from '../../components/cardDisplay/cardSwiper'
import DPSHeader from '../../components/dpsPlayerBlock/dpsHeader'
import StatBlock from '../../components/statBlock/statBlock'
import { Player } from '../../components/json/player'
import styles from './PlayerPage.module.css'
import { Col, Row } from 'react-bootstrap'
import Error from 'next/error'
import Layout from '../../components/layout/Layout'
import Drafts from '../api/draft/drafts.json'
import Players from '../api/player/players.json'
import { Draft } from '../../components/json/draft'
import EventScroller from '../../components/eventScroller/EventScroller'

export async function getStaticProps({ params }) {
    const pl: Player[] = Players
    const p = pl.find((d) => (d.playerID === params.pid))
    if (p === undefined) { return { props: { errorCode: 404, player: {} } } } else { return { props: { errorCode: true, player: p } } }
    // const req = await fetch(`http://localhost:3000/api/player/${params.pid}`)
    // const data = await req.json();
    // const error = (req.status === 200);
    // if (error) {
    //     const data2: Player = data.player;
    //     return {
    //         props: { errorCode: error, player: data2 }
    //     }
    // } else {
    //     return {
    //         props: { errorCode: error, player: {} }
    //     }
    // }
}
export async function getStaticPaths() {
    return {
        paths: Object.keys(PlayerNames).map((d) => { return { params: { pid: d } } }),
        fallback: false
    }
}

const DraftPlayerContainer = ({ errorCode, player }) => {
    if (!errorCode) { return <Error statusCode={404}></Error> }
    const drfts: Draft[] = Drafts

    return (
        <>
            <div className={`container flex-shrink-0 pb-2`}>
                <Row className={`justify-content-center`}>
                    <div className={`d-flex flex flex-row justify-content-center flex-wrap ${styles.gaptool} ${styles.maxwidthutil} col-sm-12 col-md`}>
                        {player.stats?.length > 0 ? player.stats.map((stat, index) => (
                            <StatBlock stat={stat} key={index} />
                        )) : <></>}
                        {player.cards?.length > 0 ? <CardSwiper cardsList={player.cards} /> : <></>}
                    </div>
                    <Col className={`col-sm-12 col-md-6 d-flex flex-column gap-3`}>
                        {player.dps ? <DPSHeader dps={player.dps} /> : <></>}
                        <EventScroller drfts={drfts.filter((d) => { return d.players.find((e) => e.playerID === player.playerID) })} />
                    </Col>
                </Row>
            </div>
        </>
    )
}

DraftPlayerContainer.getLayout = function getLayout(page: ReactElement) {
    return ( // page.props.player.mana ?? 'cwubrg'
        <Layout title={PlayerNames[page.props.player.playerID]} mana={page.props.player.mana ?? ''}>
            {page}
        </Layout>
    )
}

export default DraftPlayerContainer