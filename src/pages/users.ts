import {
    Props,
    UsersPage,
} from '../components/pages/users/UsersPage'
import {GetServerSideProps} from 'next'
import Amplify from 'aws-amplify'
import awsconfig from '../aws-exports'
import {
    ListUsersQuery,
    ListUsersQueryVariables,
} from '../lib/apis/graphql/API'
import {
    addApolloState,
    initializeApollo,
} from '../lib/apollo'
import {getAllUsers} from '../lib/apis/graphql'

Amplify.configure({...awsconfig, ssr: true})

export default UsersPage

export const getServerSideProps: GetServerSideProps<Props, { page: string }> = async ({query}) => {
    const pageIndex = parseInt(query.page as string, 10) || 1
    const apolloClient = initializeApollo()

    await apolloClient.query<ListUsersQuery, ListUsersQueryVariables>({
        query: getAllUsers,
        variables: {
            // @ts-ignore
            limit: pageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        },
    })

    return addApolloState(apolloClient, {
        props: {},
    })
}
