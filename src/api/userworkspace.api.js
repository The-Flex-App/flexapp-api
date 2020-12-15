import { readFileSync } from 'fs';
import { userWorkspaceService } from '../services/userworkspace.service';

export const typeDefs = readFileSync(
  `${__dirname}/userworkspace.api.graphql`,
  'utf8'
);

export const resolvers = {
  Query: {
    getUserWorkSpaces: (parent, { workspaceId }, ctx, info) => {
      return userWorkspaceService.findByWorkspaceId(workspaceId);
    },

    userWorkspaceInfoByRole: (parent, { role }, ctx, info) => {
      return userWorkspaceService.findByRole(role);
    },
  },
  Mutation: {
    removeUserWorkspace: (parent, { input }, ctx, info) => {
      return userWorkspaceService.removeUserWorkspace(input);
    },
  },
};
