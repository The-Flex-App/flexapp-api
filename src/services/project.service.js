import BaseService from './base.service';
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

    await Project.query().deleteById(id);

    return project;
  }

  async findByTitle(title) {
    return Project.query().findOne('title', title);
  }

  async findProjectByWorkspaceId(workspaceId, orderBy = {}) {
    const { field = '', direction = 'asc' } = orderBy;

    let query = Project.query().where('workspaceId', workspaceId);
    if (field) {
      query = query.orderBy(field, direction);
    }
    return query;
  }
}

export const projectService = new ProjectService();
