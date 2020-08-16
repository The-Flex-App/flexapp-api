import BaseService from './base.service';
import Project from '../models/project.model';
import { transaction } from 'objection';

class ProjectService extends BaseService {
  constructor() {
    super(Project);
  }

  async createProject(creatorId, editProjectReq) {
    editProjectReq.creatorId = creatorId;

    let trx;
    try {
      trx = await transaction.start(Project.knex());

      const project = await Project.query(trx).insert(editProjectReq);

      await trx.commit();

      return project;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async editProject(id, editProjectReq) {
    let trx;
    try {
      trx = await transaction.start(Project.knex());

      await Project.query(trx).findById(id).patch(editProjectReq);
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
}

export const projectService = new ProjectService();
