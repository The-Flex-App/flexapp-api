import BaseService from './base.service';
import Video from '../models/video.model';
import { transaction } from 'objection';
import S3UtilService from '../utils/s3Utils';

class VideoService extends BaseService {
  constructor() {
    super(Video);
  }

  async createVideo(input) {
    let trx;
    try {
      trx = await transaction.start(Video.knex());

      const video = await Video.query(trx).insert(input);

      await trx.commit();

      return video;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async editVideo(id, input) {
    let trx;
    try {
      trx = await transaction.start(Video.knex());

      await Video.query(trx).findById(id).patch(input);
      const video = await Video.query(trx).findById(id);

      await trx.commit();

      return video;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  getVideoObject(videos) {
    const videoObjArray = [];
    videos.forEach((video) => {
      videoObjArray.push({ Key: video.video });
    });
    return videoObjArray;
  }

  async deleteVideo(id) {
    const video = await this.findById(id);
    await S3UtilService.deleteObjects(this.getVideoObject([video]));
    await Video.query().deleteById(id);
    return video;
  }

  async deleteVideoByProjectId(projectId) {
    const videos = await Video.query().where('projectId', projectId);
    if (videos.length) {
      await S3UtilService.deleteObjects(this.getVideoObject(videos));
      const result = await Video.query().delete().where('projectId', projectId);
      return result;
    }
    return false;
  }

  async deleteVideoByTopicId(topicId) {
    const videos = await Video.query().where('topicId', topicId);
    if (videos.length) {
      await S3UtilService.deleteObjects(this.getVideoObject(videos));
      const result = await Video.query().delete().where('topicId', topicId);
      return result;
    }
    return false;
  }

  async findByProject(projectId, orderBy = {}) {
    const { field = '', direction = 'asc' } = orderBy;

    let query = Video.query().where('projectId', projectId);

    if (field && query) {
      query = query.orderBy(field, direction);
    }

    return query;
  }

  async findByTopics(topicIds, orderBy = {}) {
    const { field = 'updatedAt', direction = 'desc' } = orderBy;

    let query = Video.query()
      .select('videos.*', 'users.firstName', 'users.lastName', 'users.email')
      .leftJoin('users', 'videos.userId', 'users.id')
      .whereIn('topicId', topicIds);

    if (field && query) {
      query = query.orderBy(field, direction);
    }

    return query;
  }

  async findByTopic(projectId, topicId, orderBy = {}) {
    const { field = 'updatedAt', direction = 'desc' } = orderBy;

    let query = Video.query()
      .select('videos.*', 'users.firstName', 'users.lastName', 'users.email')
      .leftJoin('users', 'videos.userId', 'users.id')
      .where('topicId', topicId)
      .where('projectId', projectId);

    if (field && query) {
      query = query.orderBy(field, direction);
    }

    return query;
  }
}

export const videoService = new VideoService();
