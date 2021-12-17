import {
    Props,
    UsersPage,
} from '../components/pages/users/UsersPage'
import {GetServerSideProps} from 'next'
import Amplify, {withSSRContext} from 'aws-amplify'
import awsconfig from '../aws-exports'
import {GraphQLResult} from '@aws-amplify/api-graphql'
import {listUsers} from '../lib/apis/graphql/queries'
import {ListUsersQuery} from '../lib/apis/graphql/API'

Amplify.configure({...awsconfig, ssr: true})

export default UsersPage

export const getServerSideProps: GetServerSideProps<Props, { page: string }> = async ({query, req}) => {
    const SSR = withSSRContext({req})
    const pageIndex = parseInt(query.page as string, 10) || 1

    const {data} = await (SSR.API.graphql({
        query: listUsers, variables: {},
    }) as Promise<GraphQLResult<ListUsersQuery>>)
    console.log(`>> users`, data);

    return {
        props: {
            users: data!.listUsers?.items!,
        },
    }
}
