import { readFileSync } from 'fs';
import { userService } from '../services/user.service';

export const typeDefs = readFileSync(`${__dirname}/user.api.graphql`, 'utf8');

export const resolvers = {
  Query: {
    userById: (parent, { id }, ctx, info) => {
      return userService.findById(id);
    },
    getUserInfo: (parent, { id }, ctx, info) => {
      return userService.getUserInfo(id);
    },
  },

  Mutation: {
    createUser: async (parent, { input }, ctx, info) => {
      const { invitationId, userId, id } = input;
      if (invitationId && userId) {
        // to do 

      } else if (await userService.findById(input.id)) {
        console.log('User already exists');
        return userService.getUserInfo(id);
        // throw new Error('User already exists');
      }
      return userService.createUser(input);
    },
  },
};
