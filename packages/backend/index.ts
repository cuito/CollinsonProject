import express from 'express';
import typeDefs from './schema';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4'; // Apollo Server v4 Express integration
import http from 'http'; // For the HTTP server
import cors from 'cors';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Implement your Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    greeting: (parent: undefined, { name }: { name: string }) => `Hello, ${name}!`,
  },
};

// Initialize Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Set up Express app and HTTP server
async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors());

  await apolloServer.start();

  // Apply Apollo Server middleware to Express
  app.use(
    '/api',
    express.json(), // Body parser for JSON
    expressMiddleware(apolloServer, {
      // No context function for ultimate simplicity
    }),
  );

  // 6. Start the HTTP server
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startServer();