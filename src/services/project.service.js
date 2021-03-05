import BaseService from './base.service';
import { userService } from '../services/user.service';
import { topicService } from '../services/topic.service';
import Project from '../models/project.model';
import { transaction } from 'objection';

class ProjectService extends BaseService {
  constructor() {
    super(Project);
  }

  async createProject(input) {
    let trx;

    try {
      trx = await transaction.start(Project.knex());
      const user = await userService.findByWorkspaceId(input.workspaceId);
      delete input.workspaceId;
      input.userId = user.id;
      input.order = parseInt(input.order);
      const project = await Project.query(trx).insert(input);
      await trx.commit();
      return project;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async editProject(id, input) {
    let trx;
    try {
      trx = await transaction.start(Project.knex());
      input.order = parseInt(input.order);
      await Project.query(trx).findById(id).patch(input);
      const project = await Project.query(trx).findById(id);
      await trx.commit();
      return project;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async deleteProject(id) {
    const project = await this.findById(id);
    if (project) {
      await Project.query().delete().where('id', id);
      await topicService.deleteTopicsByProjectId(id);
    }
    return project;
  }

  async findByTitle(title, userId) {
    return Project.query().findOne('title', title).where('userId', userId);
  }

  async validateProject(title, workspaceId) {
    const user = await userService.findByWorkspaceId(workspaceId);
    if (user) {
      const project = await this.findByTitle(title, user.id);
      if (project) {
        return true;
      }
      return false;
    } else {
      throw new Error('Invalid user or workspace');
    }
  }

  async findProjectByWorkspaceId(workspaceId, orderBy = {}) {
    const { field = '', direction = 'asc' } = orderBy;
    const user = await userService.findByWorkspaceId(workspaceId);
    if (user) {
      let query = await Project.query().where('userId', user.id);
      if (field) {
        query = query.orderBy(field, direction);
      }
      return query;
    }
  }
}

export const projectService = new ProjectService();
