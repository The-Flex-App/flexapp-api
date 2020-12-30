import BaseService from './base.service';
import Topic from '../models/topic.model';
import { videoService } from '../services/video.service';
import { transaction } from 'objection';

class TopicService extends BaseService {
  constructor() {
    super(Topic);
  }

  async createTopic(input) {
    let trx;

    try {
      trx = await transaction.start(Topic.knex());
      const topic = await Topic.query(trx).insert(input);
      await trx.commit();
      return topic;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async editTopic(id, input) {
    let trx;
    try {
      trx = await transaction.start(Topic.knex());
      await Topic.query(trx).findById(id).patch(input);
      const topic = await Topic.query(trx).findById(id);
      await trx.commit();
      return topic;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async deleteTopic(id) {
    const topic = await this.findById(id);
    if (topic) {
      await Topic.query().delete().where('id', id);
      await videoService.deleteVideoByTopicId(id);
    }
    return topic;
  }

  async deleteTopicsByProjectId(projectId) {
    await Topic.query().delete().where('projectId', projectId);
    await videoService.deleteVideoByProjectId(projectId);
    return true;
  }

  async findByTitle(name, projectId) {
    return Topic.query().findOne('title', name).where('projectId', projectId);
  }

  async validateTopic(title, projectId, id) {
    const topic = await this.findByTitle(title, projectId);
    if (topic) {
      // edit flow
      if (id && parseInt(topic.id, 10) === parseInt(id, 10)) {
        return false;
      }
      return true;
    }
    return false;
  }

  async findTopicByProjectId(projectId, orderBy = {}) {
    const { field = '', direction = 'asc' } = orderBy;
    let query = await Topic.query().where('projectId', projectId);
    if (field) {
      query = query.orderBy(field, direction);
    }
    return query;
  }
}

export const topicService = new TopicService();
