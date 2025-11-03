import { gql } from 'graphql-tag';

export const rankerTypeDef = gql`
  type ActivityScore {
    activity: String!
    score: Float!
  }

  type Query {
    "Returns a list of activities ranked by their suitability"
    rank(latitude: Float!, longitude: Float!): [ActivityScore!]!
  }
`;

export default rankerTypeDef;