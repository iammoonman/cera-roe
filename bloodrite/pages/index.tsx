import DraftContainer from "../components/draftContainer";
import EventScroller from "../components/eventScroller/EventScroller";
import PlayerList from "../components/playerList/PlayerList";
import Drafts from './api/draft/drafts.json'

const Home = () => {
    var drafts = Drafts.sort((a, b) => (new Date(a.date) < new Date(b.date)) === true ? 1 : ((new Date(a.date) === new Date(b.date)) ? 0 : -1))
    return (
        <div className="w-4/5 mx-auto">
            <div className="justify-center flex flex-wrap gap-1">
                <div className="flex flex-col flex-1 gap-1">
                    <div className="blockbg">
                        <h1 className="text-center text-4xl">Welcome to The Rat Zone!</h1>
                        <p>
                            This is the website for tracking and recording Magic: The Gathering limited events for the MTG Limited on TTS discord server. On this site, you'll find information on individual players and events, and our event series. Please consider joining our discord server to catch the next Friday or Saturday night draft.
                        </p>
                    </div>
                    <EventScroller drfts={drafts} />
                    <iframe src="https://discord.com/widget?id=446846339427598336&theme=dark" height="500px" allowTransparency={true} frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" title="discord-widget"></iframe>
                </div>
                <div className="flex flex-col flex-1 gap-1">
                    <DraftContainer draft={drafts[0]} showRounds={true} showExtras={true} />
                    <PlayerList />
                </div>
            </div>
        </div>
    )
}
export default Home;