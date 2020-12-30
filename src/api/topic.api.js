import { readFileSync } from 'fs';
import { topicService } from '../services/topic.service';

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
        throw new Error('Topic already exists for current Project');
      }
      return topicService.createTopic(input);
    },

    editTopic: async (parent, { id, input }, ctx, info) => {
      const { title, projectId } = input;
      if (await topicService.validateTopic(title, projectId, id)) {
        throw new Error('Topic already exists for current Project');
      }
      return topicService.editTopic(id, input);
    },

    deleteTopic: (parent, { id }, ctx, info) => {
      return topicService.deleteTopic(id);
    },
  },
};
