import { ApolloServer } from 'apollo-server-fastify'
import * as fastify from 'fastify'
import * as blipp from 'fastify-blipp'
import { loadSchemaSync } from '@graphql-tools/load'
import { addResolversToSchema } from '@graphql-tools/schema'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { join } from 'path'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { PORT } from './config'

const schemaFile = loadSchemaSync(join(__dirname, './schema.graphql'), {
  loaders: [
    new GraphQLFileLoader(),
  ],
})

const resolvers = {
  Query: {
    ping() {
      return true
    },
  },
}

const schema = addResolversToSchema({
  schema: schemaFile,
  resolvers,
})


const server = new ApolloServer({
  schema,
})

const app: fastify.FastifyInstance<Server,
  IncomingMessage,
  ServerResponse> = fastify()

app.register(blipp)

export default app;



(async () => {
  app.register(server.createHandler())
  const url = await app.listen(PORT)

  console.log(`${url}`)

  app.blipp()
})()

