import {
    Props,
    UsersPage,
} from '../components/pages/UsersPage'
import {GetServerSideProps} from 'next'
import prisma from '../lib/prisma'

export default UsersPage

export const getServerSideProps: GetServerSideProps<Props, { page: string }> = async ({query}) => {
    const pageIndex = parseInt(query.page as string, 10) || 1

    const users = await prisma.user.findMany({
        // @ts-ignore
        take: pageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
    })

    return {
        props: {
            users: users.map(({id,name,dob,description,image,address}) => ({
                id,
                name,
                description,
                image,
                address,
                dob: dob.toISOString(),
            })),
        },
    }
}
