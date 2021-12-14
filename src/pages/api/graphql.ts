import 'reflect-metadata'
import {ApolloServer} from 'apollo-server-micro'
import Cors from 'micro-cors'
import {PrismaClient} from '@prisma/client'
import prisma from '../../lib/prisma'
import {buildSchema} from 'type-graphql'
import {crudResolvers} from 'graphql/generated/type-graphql'
import path from 'path'

export type Context = {
    prisma: PrismaClient
    userId?: number
}

const cors = Cors()
let apolloServer: ApolloServer

const getServer = async () => {
    if (!apolloServer) {
        const context = (): Context => ({prisma})
        const schema = await buildSchema({
            resolvers: crudResolvers,
            emitSchemaFile: path.resolve(__dirname, '..', '..', '..', '..', 'generated-schema.graphql'),
            validate: false,
        })
        apolloServer = new ApolloServer({
            schema,
            context,
        })

        await apolloServer.start()
    }

    return apolloServer
}

export default cors(async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.end()
        return false
    }
    const server = await getServer()
    await server.createHandler({path: '/api/graphql'})(req, res)
})

export const config = {
    api: {
        bodyParser: false,
    },
}
