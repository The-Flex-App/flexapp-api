import { readFileSync } from 'fs';
import { projectService } from '../services/project.service';
import { userService } from '../services/user.service';

export const typeDefs = readFileSync(
  `${__dirname}/project.api.graphql`,
  'utf8'
);

export const resolvers = {
  Query: {
    projectById: (parent, { id }, ctx, info) => {
      return projectService.findById(id);
    },

    projectByWorkspaceId: (parent, { workspaceId }, ctx, info) => {
      return projectService.findProjectByWorkspaceId(workspaceId);
    },

    projects: (parent, { first, offset, orderBy }, ctx, info) => {
      return projectService.findAll(first, offset, orderBy);
    },
  },

  Mutation: {
    createProject: async (parent, { input }, ctx, info) => {
      if (await projectService.findByTitle(input.title)) {
        throw new Error('Project already exists');
      } else if (!userService.findByWorkspaceId(input.workspaceId)) {
        throw new Error('Invalid user or workspace');
      }
      return projectService.createProject(input);
    },

    editProject: (parent, { id, input }, ctx, info) => {
      return projectService.editProject(id, input);
    },

    deleteProject: (parent, { id }, ctx, info) => {
      return projectService.deleteProject(id);
    },
  },
};
