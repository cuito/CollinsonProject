import { gql } from 'graphql-tag';

export const helloWorldTypeDef = gql`
  type Query {
    "Returns a simple 'Hello, World!' message"
    hello: String!
  }
`;

export default helloWorldTypeDef;