import React from "react";
import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";
import BlockContainer from "../blockContainer/BlockContainer";
import DraftContainer from "../draftContainer";
import { Draft } from "../json/draft";

interface Props {
    drfts: Draft[]
}
interface State {
    show: boolean,
    showndraft: Draft
}

export default class EventScroller extends React.Component<Props, State> {
    handleClose = () => { this.setState({ show: false }) }
    handleOpen = (d: Draft) => { this.setState({ show: true, showndraft: d }) }
    constructor(props) {
        super(props);
        this.state = { show: false, showndraft: this.props.drfts[0] }
    }
    render(): ReactNode {
        return (
            <BlockContainer extraclasses="">
                <h4 style={{ marginLeft: 'auto', marginRight: 'auto', width: 'max-content' }}>Past Events</h4>
                <table style={{ width: "100%" }}>
                    <thead style={{ borderBottom: '2px solid black' }}>
                        <th style={{ width: '70%' }}>Event</th>
                        <th>Date</th>
                    </thead>
                </table>
                <div style={{ overflowY: 'scroll', maxHeight: '400px' }}>
                    <table className={`table table-hover`}>
                        <tbody>
                            {this.props.drfts.map((d, i) =>
                                <tr key={i} onClick={() => { this.handleOpen(d) }} style={{ cursor: 'pointer' }}>
                                    <td style={{ width: '70%' }}>{d.title}</td>
                                    <td>{(new Date(d.date)).toDateString()}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Modal size="lg" centered show={this.state.show} onHide={this.handleClose}>
                    <Button variant={'secondary'} style={{ position: 'absolute', zIndex: '9001', left: '50%', top: '5px', width: 'max-content', transform: 'translate(-50%)' }} onClick={()=>(this.handleClose())}>X</Button>
                    <DraftContainer draft={this.state.showndraft} showExtras={true} showRounds={true} />
                </Modal>
            </BlockContainer>
        )
    }
}