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
      let trx;
      try {
        trx = await transaction.start(Project.knex());
        await Project.query(trx).delete().where('id', id);
        await topicService.deleteTopicsByProjectId(id, trx);
        await trx.commit();
        return project;
      } catch (err) {
        await trx.rollback();
        throw err;
      }
    }
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

  async reArrangeProjects({ workspaceId, projects: projectIds }) {
    try {
      await projectIds.map(async (projectId, index) => {
        return await Project.query()
          .patch({ order: index + 1 })
          .where('id', parseInt(projectId))
          .where('workspaceId', workspaceId);
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }

  async findProjectByWorkspaceId(workspaceId) {
    const user = await userService.findByWorkspaceId(workspaceId);
    if (user) {
      let query = await Project.query()
        .where('workspaceId', workspaceId)
        .orderBy('order', 'asc');
      return query;
    }
  }
}

export const projectService = new ProjectService();
