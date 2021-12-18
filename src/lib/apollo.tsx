import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client'
import {onError} from '@apollo/link-error'
import merge from 'deepmerge'
import {IncomingHttpHeaders} from 'http'
import isEqual from 'lodash/isEqual'
import type {AppProps} from 'next/app'
import {useMemo} from 'react'
import {createAuthLink} from 'aws-appsync-auth-link'
import {createSubscriptionHandshakeLink} from 'aws-appsync-subscription-link'
import appSyncConfig from '../aws-exports'
import {
    AUTH_TYPE,
    AuthOptions,
} from 'aws-appsync-auth-link/lib/auth-link'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
const url = appSyncConfig.aws_appsync_graphqlEndpoint
const region = appSyncConfig.aws_appsync_region
const auth: AuthOptions = {
    type: appSyncConfig.aws_appsync_authenticationType as AUTH_TYPE.API_KEY,
    apiKey: appSyncConfig.aws_appsync_apiKey,
}

const httpLink = new HttpLink({
    uri: url,
    fetchOptions: {
        mode: 'cors',
    },
    headers: {
        'Access-Control-Allow-Credentials': true,
    },
})


const createApolloClient = () => {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: ApolloLink.from([
            // @ts-ignore
            onError(({graphQLErrors, networkError}) => {
                if (graphQLErrors)
                    graphQLErrors.forEach(({message, locations, path}) =>
                        console.log(
                            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                        ),
                    )
                if (networkError)
                    console.log(`[Network error]: ${networkError}. Backend is unreachable. Is it running?`)
            }),
            createAuthLink({url, region, auth}),
            createSubscriptionHandshakeLink({url, region, auth}, httpLink),
        ]),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        listUsers: {
                            read(existing, {
                                args: {
                                    // Default to returning the entire cached list,
                                    // if limit are not provided.
                                    // @ts-ignore
                                    limit,
                                } = {},
                            }) {
                                return {
                                    items: !limit || limit > existing?.items.length - 1
                                        ? existing?.items
                                        : existing?.items.slice(0, limit),
                                }
                            },
                            // Don't cache separate results based on
                            // any of this field's arguments.
                            keyArgs: false,
                        },
                    },
                },
            },
        }),
    })
}

type InitialState = NormalizedCacheObject | undefined;

interface IInitializeApollo {
    headers?: IncomingHttpHeaders | null;
    initialState?: InitialState | null;
}

export const initializeApollo = (initialState?: IInitializeApollo) => {
    const _apolloClient = apolloClient ?? createApolloClient()

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
            ],
        })

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export const addApolloState = (
    client: ApolloClient<NormalizedCacheObject>,
    pageProps: AppProps['pageProps'],
) => {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
    }

    return pageProps
}

export function useApollo(pageProps: AppProps['pageProps']) {
    const state = pageProps[APOLLO_STATE_PROP_NAME]
    const store = useMemo(() => initializeApollo(state), [state])
    return store
}
