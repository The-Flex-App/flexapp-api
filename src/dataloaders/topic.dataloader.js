import DataLoader from 'dataloader';
import { topicService } from '../services/topic.service';

export class TopicByProjectDataLoader extends DataLoader {
  constructor() {
    const batchLoader = (projectIds) => {
      return topicService.findTopicByProjectId(projectIds).then((topics) =>
        projectIds.map((projectId) => {
          return topics.filter((topic) => topic.projectId == projectId);
        })
      );
    };

    super(batchLoader);
  }

  static getInstance(context) {
    if (!context.topicByProjectDataLoader) {
      context.topicByProjectDataLoader = new TopicByProjectDataLoader();
    }

    return context.topicByProjectDataLoader;
  }
}
