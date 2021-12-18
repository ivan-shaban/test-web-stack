import '../styles/globals.css'
import Head from 'next/head'
import type {AppProps} from 'next/app'
import {AmplifyAuthenticator} from '@aws-amplify/ui-react'
import {Amplify} from 'aws-amplify'
import {useApollo} from '../lib/apollo'
import {ApolloProvider} from '@apollo/client'

// hack to expose `Amplify` & its categories on `window` for e2e testing
if (typeof window !== 'undefined') {
    // @ts-ignore
    window['Amplify'] = Amplify
}

function MyApp({Component, pageProps}: AppProps) {
    const apolloClient = useApollo(pageProps)

    return (
        <>
            <Head>
                <title>Test app: Nextjs + AWS Amplify + GraphQL</title>
                <meta name="viewport"
                      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"/>
            </Head>
            <ApolloProvider client={apolloClient}>
                <AmplifyAuthenticator>
                    <Component {...pageProps} />
                </AmplifyAuthenticator>
            </ApolloProvider>
        </>
    )
}

export default MyApp
