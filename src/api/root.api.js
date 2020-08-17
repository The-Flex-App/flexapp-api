import { readFileSync } from 'fs';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

export const typeDefs = readFileSync(`${__dirname}/root.api.graphql`, 'utf8');

export const resolvers = {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,

  Query: {
    sayHello: (parent, args, ctx, info) => {
      return `Hello ${args.name}!`;
    },
  },

  Mutation: {
    sayHello: (parent, args, ctx, info) => {
      return `Hello ${args.name}!`;
    },
  },
};
