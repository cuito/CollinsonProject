const helloworldResolvers = {
  Query: {
    hello: () => 'Hello World!',
    greeting: (parent: undefined, { name }: { name: string }) => `Hello, ${name}!`,
  },
};

export default helloworldResolvers;