import { readFileSync } from 'fs';
import { topicService } from '../services/topic.service';
import { VideoByTopicDataLoader } from '../dataloaders/video.dataloader';

export const typeDefs = readFileSync(`${__dirname}/topic.api.graphql`, 'utf8');

export const resolvers = {
  Query: {
    topicById: (parent, { id }, ctx, info) => {
      return topicService.findById(id);
    },

    topicsByProjectId: (parent, { projectId }, ctx, info) => {
      return topicService.findTopicByProjectId(projectId);
    },
  },

  Mutation: {
    createTopic: async (parent, { input }, ctx, info) => {
      const { title, projectId } = input;
      if (await topicService.validateTopic(title, projectId)) {
        throw new Error('Activity already exists for current Goal');
      }
      return topicService.createTopic(input);
    },

    editTopic: async (parent, { id, input }, ctx, info) => {
      const { title, projectId } = input;
      if (await topicService.validateTopic(title, projectId, id)) {
        throw new Error('Activity already exists for current Goal');
      }
      return topicService.editTopic(id, input);
    },

    deleteTopic: (parent, { id }, ctx, info) => {
      return topicService.deleteTopic(id);
    },
  },

  Topic: {
    videos: ({ id }, args, context, info) => {
      const videoByTopicDataLoader = VideoByTopicDataLoader.getInstance(
        context
      );
      return videoByTopicDataLoader.load(id);
    },
  },
};
