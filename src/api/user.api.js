import { readFileSync } from 'fs';
import { userService } from '../services/user.service';
import { invitationService } from '../services/invitation.service';

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
      const { inviteId, workspaceId, id } = input;
      if (inviteId && workspaceId) {
        // invite flow
        if (await invitationService.validateInvite(input)) {
          return userService.createUser(input);
        } else {
          throw new Error('Invalid or expired invitation');
        }
      } else if (await userService.findById(id)) {
        // normal member and owner workspace flow
        if (workspaceId && !userService.findByWorkspaceId(input.workspaceId)) {
          throw new Error('Invalid user or workspace');
        }
        return userService.getUserInfo(id, workspaceId);
      }
      return userService.createUser(input);
    },
  },
};
