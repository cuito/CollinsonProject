import express from 'express';
import apolloServer from './graphql/schema';
import { expressMiddleware } from '@as-integrations/express4'; // Apollo Server v4 Express integration
import cors from 'cors';

const app = express();

app.use(cors());

// Set up Express app and HTTP server
async function startServer() {
  await apolloServer.start();

  // Apply Apollo Server middleware to Express
  app.use(
    '/api',
    express.json(), // Body parser for JSON
    expressMiddleware(apolloServer, {
      // No context function for ultimate simplicity
    }),
  );
}

startServer();

export default app;