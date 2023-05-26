import Head from "next/head";
import React, { Component } from "react";
import { ReactNode } from "react";
import { SSRProvider } from "react-bootstrap";
import DraftBanner from "../banner/DraftBanner";

interface Props {
    children: any,
    title?:string,
    mana?: string
}

export default class Layout extends React.Component<Props> {
    render(): ReactNode {
        return (
            <>
                <Head>
                    <meta charSet="utf-8" />
                    <link rel="icon" href="./favicon.ico" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="theme-color" content="#4d4e50" />
                    <meta name="The Rat Zone MTG" content="Magic The Gathering Site for Limited" />
                    <link rel="manifest" href="./manifest.json" />
                    <title>THE RAT ZONE</title>
                </Head>
                <SSRProvider>
                    <DraftBanner title={this.props.title} mana={this.props.mana ?? ''}/>
                    {this.props.children}
                </SSRProvider>
                <footer className="footerdiv">
                    <div className='footertext'>
                        Wizards of the Coast, Magic: The Gathering, and their logos and symbols are trademarks of Wizards of the
                        Coast LLC. Discord and its logos and symbols are trademarks of Discord Inc. This site is not affiliated with
                        those companies. The banner image was created by Alayna Danner.
                    </div>
                </footer>
            </>
        )
    }
}