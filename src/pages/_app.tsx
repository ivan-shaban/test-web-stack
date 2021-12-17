import '../styles/globals.css'
import Head from 'next/head'
import type {AppProps} from 'next/app'
import {AmplifyAuthenticator} from '@aws-amplify/ui-react'
import {Amplify} from 'aws-amplify'

// hack to expose `Amplify` & its categories on `window` for e2e testing
if (typeof window !== 'undefined') {
    // @ts-ignore
    window['Amplify'] = Amplify
}

function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <title>Test app: Nextjs + Prisma + GraphQL + SQLite</title>
                <meta name="viewport"
                      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"/>
            </Head>
            <AmplifyAuthenticator>
                <Component {...pageProps} />
            </AmplifyAuthenticator>
        </>
    )
}

export default MyApp
