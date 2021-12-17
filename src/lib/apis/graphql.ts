import gql from 'graphql-tag'

export const GET_ALL_USERS_QUERY = gql`
    query Query($take: Int, $where: UserWhereInput) {
        users(take: $take, where: $where) {
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

export const DELETE_USER_MUTATION = gql`
    mutation Mutation($where: UserWhereUniqueInput!) {
        deleteUser(where: $where) {
            id
        }
    }
`
