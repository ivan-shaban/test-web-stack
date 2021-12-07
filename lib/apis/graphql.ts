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
    }`
