import { readFileSync } from 'fs';
import { projectService } from '../services/project.service';
import { TopicByProjectDataLoader } from '../dataloaders/topic.dataloader';

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
      const { title, workspaceId } = input;
      if (await projectService.validateProject(title, workspaceId)) {
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

  Project: {
    topics: ({ id }, args, context, info) => {
      const topicByProjectDataLoader = TopicByProjectDataLoader.getInstance(
        context
      );
      return topicByProjectDataLoader.load(id);
    },
  },
};
