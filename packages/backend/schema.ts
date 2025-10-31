import { gql } from 'graphql-tag';

// Define your GraphQL schema to match the 'hello' and 'greeting' resolvers
export const typeDefs = gql`
  type Query {
    hello: String # Matches the 'hello' resolver
    greeting(name: String!): String # Matches the 'greeting' resolver
  }
`;

export default typeDefs;