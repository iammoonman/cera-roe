import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { ReactElement, ReactNode, useEffect } from 'react';
import { AppProps } from 'next/app';
import { NextPage } from 'next';
import Layout from '../components/layout/Layout';
import PlayerNames from '../components/json/playerNames.json'
import React from 'react';

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export const PNContext = React.createContext(PlayerNames)

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? function (d) { return <Layout>{d}</Layout> }
    return (
        <PNContext.Provider value={PlayerNames} >
            {getLayout(<Component {...pageProps} />)}
        </PNContext.Provider >
    )
}
export default MyApp;