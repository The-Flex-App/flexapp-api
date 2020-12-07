import { readFileSync } from 'fs';
import { userService } from '../services/user.service';
import { UserDataLoader } from '../dataloaders/user.dataloader';

export const typeDefs = readFileSync(`${__dirname}/user.api.graphql`, 'utf8');

export const resolvers = {
  Query: {
    userById: (parent, { username }, ctx, info) => {
      return userService.findById(username);
    }
  },

  Mutation: {
    createUser: async (parent, { input }, ctx, info) => {
      console.log(input);
      if (await userService.findByTitle(input.username)) {
        throw new Error('User already exists');
      }
      return userService.createUser(input);
    },
  },
};
