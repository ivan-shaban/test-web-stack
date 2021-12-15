import {
    Props,
    UsersPage,
} from '../components/pages/users/UsersPage'
import {GetServerSideProps} from 'next'
import {
    addApolloState,
    initializeApollo,
} from '../lib/apollo'
import {GET_ALL_USERS_QUERY} from '../lib/apis/graphql'
import {User} from 'graphql/generated/type-graphql/models/User'
import Amplify, {
    API,
    withSSRContext,
} from 'aws-amplify'
import awsconfig from '../aws-exports'
import {GraphQLResult} from '@aws-amplify/api-graphql'
import {ListUsersQuery} from '../API'
import {listUsers} from '../graphql/queries'

Amplify.configure({...awsconfig, ssr: true})

export default UsersPage

export const getServerSideProps: GetServerSideProps<Props, { page: string }> = async ({query, req}) => {
    const SSR = withSSRContext({req})
    const pageIndex = parseInt(query.page as string, 10) || 1

    const {data} = await (SSR.API.graphql({
        query: listUsers, variables: {},
    }) as Promise<GraphQLResult<ListUsersQuery>>)
    console.log(`>> users`, data);
    // const apolloClient = initializeApollo()
    //
    // await apolloClient.query<{ users: User[] }, { take: number }>({
    //     query: GET_ALL_USERS_QUERY,
    //     variables: {
    //         // @ts-ignore
    //         take: pageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
    //     },
    // })
    //
    // return addApolloState(apolloClient, {
    //     props: {},
    // })

    return {
        props: {
            users: data!.listUsers?.items!,
        },
    }
}
