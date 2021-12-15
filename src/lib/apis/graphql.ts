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
