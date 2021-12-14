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

export default UsersPage

export const getServerSideProps: GetServerSideProps<Props, { page: string }> = async ({query}) => {
    const pageIndex = parseInt(query.page as string, 10) || 1
    const apolloClient = initializeApollo()

    await apolloClient.query<{ users: User[] }, { take: number }>({
        query: GET_ALL_USERS_QUERY,
        variables: {
            // @ts-ignore
            take: pageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        },
    })

    return addApolloState(apolloClient, {
        props: {},
    })
}
