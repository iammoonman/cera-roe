import React from "react";
import { ReactNode } from "react";
import { Col, Dropdown, Row } from "react-bootstrap";
import { Draft } from "../json/draft";

interface Props {
    drafts: Draft[]
}
interface State {

}

export default class DraftLinker extends React.Component<Props, State> {
    render(): ReactNode {
        return (
            <Dropdown bsPrefix='dropdown'>
                <Dropdown.Toggle bsPrefix='dropdown-toggle btn btn-secondary'>
                    Skip To Draft
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Row>
                        <Col sm={6} bsPrefix={`semiborder col`}>
                        {this.props.drafts.map((d, i) => (
                            i < this.props.drafts.length / 2 ?
                            <Dropdown.Item href={"#Draft" + d.draftID} key={i} bsPrefix='d-flex px-2 py-1 justify-content-between'>
                                <span>{d.title}</span><span>{d.date}</span>
                            </Dropdown.Item> : null
                        ))}
                        </Col>
                        <Col sm={6}>
                        {this.props.drafts.map((d, i) => (
                            i >= this.props.drafts.length / 2 ?
                            <Dropdown.Item href={"#Draft" + d.draftID} key={i} bsPrefix='d-flex px-2 py-1 justify-content-between'>
                                <span>{d.title}</span><span>{d.date}</span>
                            </Dropdown.Item> : null
                        ))}
                        </Col>
                    </Row>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}