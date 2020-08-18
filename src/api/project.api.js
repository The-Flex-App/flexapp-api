import { readFileSync } from 'fs';
import { projectService } from '../services/project.service';
import { UserDataLoader } from '../dataloaders/user.dataloader';

export const typeDefs = readFileSync(`${__dirname}/project.api.graphql`, 'utf8');

export const resolvers = {
  Query: {
    projectById: (parent, { id }, ctx, info) => {
      return projectService.findById(id);
    },

    projects: (parent, { first, offset }, ctx, info) => {
      return projectService.findAll(first, offset);
    },
  },

  Mutation: {
    createProject: async (parent, { input }, ctx, info) => {
      console.log(input);
      if (await projectService.findByTitle(input.title)) {
        throw new Error('Project already exists');
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
