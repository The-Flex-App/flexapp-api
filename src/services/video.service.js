import BaseService from './base.service';
import Video from '../models/video.model';
import { transaction } from 'objection';

class VideoService extends BaseService {
  constructor() {
    super(Video);
  }

  async createVideo(creatorId, editVideoReq) {
    editVideoReq.creatorId = creatorId;

    let trx;
    try {
      trx = await transaction.start(Video.knex());

      const video = await Video.query(trx).insert(editVideoReq);

      await trx.commit();

      return video;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async editVideo(id, editVideoReq) {
    let trx;
    try {
      trx = await transaction.start(Video.knex());

      await Video.query(trx).findById(id).patch(editVideoReq);
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
}

export const videoService = new VideoService();
