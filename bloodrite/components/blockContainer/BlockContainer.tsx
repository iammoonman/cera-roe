import React from "react";

interface Props{
    styles?: React.CSSProperties
    extraclasses?: string
}

export default class BlockContainer extends React.Component<Props>{
    render(): React.ReactNode{
        return (
            <div className={`blockbg ${this.props.extraclasses}`} style={this.props.styles}>
                {this.props.children}
            </div>
        )
    }
}