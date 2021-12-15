import gql from 'graphql-tag'

export const getAllUsers = /* GraphQL */ `
    query MyQuery {
        listUsers {
            items {
                id
                address
                dob
                name
            }
        }
    }
`

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

export const DELETE_USER_MUTATION = gql`
    mutation Mutation($where: UserWhereUniqueInput!) {
        deleteUser(where: $where) {
            id
        }
    }
`
