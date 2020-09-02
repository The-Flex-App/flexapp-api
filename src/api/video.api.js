import { readFileSync } from 'fs';
import { videoService } from '../services/video.service';

export const typeDefs = readFileSync(`${__dirname}/video.api.graphql`, 'utf8');

export const resolvers = {
  Query: {
    videoById: (parent, { id }, ctx, info) => {
      return videoService.findById(id);
    },

    videosByProject: (parent, { projectId }, ctx, info) => {
      return videoService.findByProject(projectId);
    },

    videos: (parent, { first, offset, orderBy }, ctx, info) => {
      return videoService.findAll(first, offset, orderBy);
    },
  },

  Mutation: {
    createVideo: (parent, { input }, ctx, info) => {
      return videoService.createVideo(input);
    },

    editVideo: (parent, { id, input }, ctx, info) => {
      return videoService.editVideo(id, input);
    },

    deleteVideo: (parent, { id }, ctx, info) => {
      return videoService.deleteVideo(id);
    },
  },
};
