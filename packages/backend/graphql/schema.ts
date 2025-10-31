import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from './index'; 

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export default apolloServer;