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

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

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
            new HttpLink({
                uri: 'http://localhost:3000/api/graphql',
                credentials: 'include',
            }),
        ]),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        users: {
                            read(existing, {
                                args: {
                                    // Default to returning the entire cached list,
                                    // if offset and limit are not provided.
                                    // @ts-ignore
                                    skip = 0,
                                    // @ts-ignore
                                    take = existing?.length,
                                } = {},
                            }) {
                                return existing && existing.slice(skip, skip + take)
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
