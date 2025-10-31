import helloworldTypeDefs from './modules/helloworld/helloworld.typeDef';
import helloworldResolvers from './modules/helloworld/helloworld.resolver';

const typeDefs = [
  helloworldTypeDefs,
];

const resolvers = [
  helloworldResolvers,
];

export { typeDefs, resolvers };