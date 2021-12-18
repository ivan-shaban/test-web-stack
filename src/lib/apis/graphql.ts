import {gql} from '@apollo/client'

export const getAllUsers = gql`
    query ListUsers(
        $filter: ModelUserFilterInput
        $limit: Int
    ) {
        listUsers(filter: $filter, limit: $limit) {
            items {
                id
                name
                dob
                image
                address
                description
            }
        }
    }
`
