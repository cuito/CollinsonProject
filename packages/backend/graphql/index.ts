import helloworldTypeDefs from './modules/helloworld/helloworld.typeDef';
import helloworldResolvers from './modules/helloworld/helloworld.resolver';
import rankerTypeDefs from './modules/ranker/ranker.typeDef';
import rankerResolvers from './modules/ranker/ranker.resolver';

const typeDefs = [
  helloworldTypeDefs,
  rankerTypeDefs,
];

const resolvers = [
  helloworldResolvers,
  rankerResolvers,
];

export { typeDefs, resolvers };