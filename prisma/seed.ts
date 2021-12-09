import prisma from '../lib/prisma'
import {config} from 'dotenv'
import axios from 'axios'
import {unsplashAPI} from '../lib/apis/unsplash'

const result = config()

if (result.error) {
  throw result.error
}


type MockUserData = {
    readonly id: number,
    readonly name: string,
    readonly username: string,
    readonly email: string,
    readonly address: {
        readonly street: string,
        readonly suite: string,
        readonly city: string,
        readonly zipcode: string,
        readonly geo: {
            readonly lat: string,
            readonly lng: string
        }
    },
    readonly phone: string,
    readonly website: string,
    readonly company: {
        readonly name: string,
        readonly catchPhrase: string,
        readonly bs: string
    }
}

async function main() {
    const totalUsersCount = 30

    // here we get only 10 users, so we will map them to unique avatars
    const {data: users} = await axios.get<MockUserData[]>('https://jsonplaceholder.typicode.com/users')
    const result = await unsplashAPI.photos.getRandom({
        count: totalUsersCount,
        query: 'avatars',
    })
    const images = Array.isArray(result.response) ? result.response! : [result.response!]

    // cleanup db
    await prisma.user.deleteMany()
    const usersToInit = images.map(({urls: {raw}}, index) => {
        const user = users[index % 10]
        return prisma.user.create({
            data: {
                name: user.name,
                dob: new Date('1990-01-01'),
                address: `${user.address.city}, ${user.address.street}`,
                image: `${raw}&fm=jpg&w=168&h=168&fit=crop`,
                description: user.company.catchPhrase,
            },
        })
    })

    return Promise.all(usersToInit)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
