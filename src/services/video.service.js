import BaseService from './base.service';
import Video from '../models/video.model';
import { transaction } from 'objection';

class VideoService extends BaseService {
  constructor() {
    super(Video);
  }

  async createVideo(input) {
    let trx;
    input.creatorId = 1;
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

  async deleteVideo(id) {
    const video = await this.findById(id);

    await Video.query().deleteById(id);

    return video;
  }

  async findByProject(projectId, orderBy = {}) {
    const { field = '', direction = 'asc' } = orderBy;

    let query = Video.query().where('projectId', projectId);

    if (field) {
      query = query.orderBy(field, direction);
    }

    return query;
  }
}

export const videoService = new VideoService();
