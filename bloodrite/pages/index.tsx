import { Container, Row, Col } from "react-bootstrap";
import BlockContainer from "../components/blockContainer/BlockContainer";
import DraftContainer from "../components/draftContainer";
import EventScroller from "../components/eventScroller/EventScroller";
import PlayerList from "../components/playerList/PlayerList";
import Drafts from './api/draft/drafts.json'

const Home = () => {
    var drafts = Drafts.sort((a, b) => (new Date(a.date) < new Date(b.date)) === true ? 1 : ((new Date(a.date) === new Date(b.date)) ? 0 : -1))
    return (
        <Container>
            <Row className="justify-content-center">
                <Col style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <BlockContainer>
                        <h1 style={{ textAlign: 'center' }}>Welcome to The Rat Zone!</h1>
                        <p>
                            This is the website for tracking and recording Magic: The Gathering limited events for the MTG Limited on TTS discord server. On this site, you'll find information on individual players and events, and our event series. Please consider joining our discord server to catch the next Friday or Saturday night draft.
                        </p>
                    </BlockContainer>
                    <EventScroller drfts={drafts} />
                    <iframe src="https://discord.com/widget?id=446846339427598336&theme=dark" height="500px" allowTransparency={true} frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" title="discord-widget"></iframe>
                </Col>
                <Col style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <DraftContainer draft={drafts[0]} showRounds={true} showExtras={true} />
                    <PlayerList />
                </Col>
            </Row>
        </Container>
    )
}
export default Home;