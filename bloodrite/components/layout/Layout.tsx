import Head from "next/head";
import React, { Component } from "react";
import { ReactNode } from "react";
import DraftBanner from "../banner/DraftBanner";

interface Props {
	children: any;
	title?: string;
	mana?: string;
}

const Layout = (props: Props) => {
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
			<DraftBanner title={props.title} mana={props.mana ?? ""} />
			{props.children}
			<footer className="w-full flex flex-wrap justify-between mt-auto">
				<div className="text-gray-500 text-center text-sm w-full bg-black">Wizards of the Coast, Magic: The Gathering, and their logos and symbols are trademarks of Wizards of the Coast LLC. Discord and its logos and symbols are trademarks of Discord Inc. This site is not affiliated with those companies. The banner image was created by Alayna Danner.</div>
			</footer>
		</>
	);
};
export default Layout;
