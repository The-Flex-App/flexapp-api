import { readFileSync } from 'fs';
import { projectService } from '../services/project.service';
import { UserDataLoader } from '../dataloaders/user.dataloader';

export const typeDefs = readFileSync(`${__dirname}/project.api.graphql`, 'utf8');

export const resolvers = {
  Query: {
    projectById: (obj, { id }, context, info) => {
      return projectService.findById(id);
    },

    projects: (obj, { first, offset }, context, info) => {
      return projectService.findAll(first, offset);
    },
  },

  Mutation: {
    createProject: (obj, { editProjectReq }, { authUser }, info) => {
      if (await projectService.findByTitle(editProjectReq.title)) {
        return {
          success: false,
          message: 'Project address exists!',
          user: undefined,
        };
      }

      return projectService.createProject(authUser.id, editProjectReq);
    },

    editProject: (obj, { id, editProjectReq }, context, info) => {
      return projectService.editProject(id, editProjectReq);
    },

    deleteProject: (obj, { id }, context, info) => {
      return projectService.deleteProject(id);
    },
  },

  Project: {
    creator: ({ creatorId }, args, context, info) => {
      const userDataLoader = UserDataLoader.getInstance(context);

      return userDataLoader.load(creatorId);
    },
  },
};
