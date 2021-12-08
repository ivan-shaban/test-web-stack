import gql from 'graphql-tag'

export const GET_ALL_USERS_QUERY = gql`
    query Users($take: Int) {
        users(take: $take) {
            id
            name
            dob
            address
            image
            description
        }
    }
`

export const UPDATE_USER_MUTATION = gql`
    mutation Mutation($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
        updateUser(data: $data, where: $where) {
            name
            address
            description
        }
    }
`
