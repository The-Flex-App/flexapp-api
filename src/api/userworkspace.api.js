import { readFileSync } from 'fs';
import { userWorkspaceService } from '../services/userworkspace.service';

export const typeDefs = readFileSync(`${__dirname}/userworkspace.api.graphql`, 'utf8');

export const resolvers = {
  Query: {
    userWorkspaceInfoById: (parent, { workspaceId }, ctx, info) => {
      return userWorkspaceService.findByWorkspaceId(workspaceId);
    }, 

    userWorkspaceInfoByRole: (parent, { role }, ctx, info) => {
      return userWorkspaceService.findByRole(role);
    }, 
  },
};
