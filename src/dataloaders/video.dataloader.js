import DataLoader from 'dataloader';
import { videoService } from '../services/video.service';

export class VideoByTopicDataLoader extends DataLoader {
  constructor() {
    const batchLoader = (topicIds) => {
      return videoService.findByTopics(topicIds).then((videos) =>
        topicIds.map((topicId) => {
          return videos.filter((video) => video.topicId == topicId);
        })
      );
    };

    super(batchLoader);
  }

  static getInstance(context) {
    if (!context.videoByTopicDataLoader) {
      context.videoByTopicDataLoader = new VideoByTopicDataLoader();
    }

    return context.videoByTopicDataLoader;
  }
}
