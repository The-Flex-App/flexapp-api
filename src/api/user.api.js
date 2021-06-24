import { readFileSync } from 'fs';
import { userService } from '../services/user.service';
import { invitationService } from '../services/invitation.service';
import { v4 as uuidv4 } from 'uuid';

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
      const { inviteId, workspaceId } = input;
      const existingUser = await userService.isExistingUser(input);
      if (!input.id) {
        // if userid doesn't exist for edit flow then getting it from the table
        if (existingUser) {
          input.id = existingUser.id;
        } else {
          input.id = uuidv4();
        }
      }
      if (inviteId && workspaceId) {
        // invite flow
        if (await invitationService.validateInvite(input)) {
          return userService.createUser(input);
        } else {
          throw new Error('Invalid or expired invitation');
        }
      } else if (existingUser) {
        // normal member and owner workspace flow
        if (workspaceId && !userService.findByWorkspaceId(workspaceId)) {
          throw new Error('Invalid user or workspace');
        }
        return userService.getUserInfo(input.id, workspaceId);
      }
      return userService.createUser(input);
    },
  },
};
