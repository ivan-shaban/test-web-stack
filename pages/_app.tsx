import '../styles/globals.css'
import Head from 'next/head'
import type {AppProps} from 'next/app'
import {useApollo} from '../lib/apollo'
import {ApolloProvider} from '@apollo/client'

function MyApp({Component, pageProps}: AppProps) {
    const apolloClient = useApollo(pageProps)

    return (
        <>
            <Head>
               <title>Test app: Nextjs + Prisma + GraphQL + SQLite</title>
             </Head>
            <ApolloProvider client={apolloClient}>
                <Component {...pageProps} />
            </ApolloProvider>
        </>
    )
}

export default MyApp
