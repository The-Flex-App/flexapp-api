import BaseService from './base.service';
import UserWorkspace from '../models/userworkspace.model';

class UserWorkspaceService extends BaseService {
  constructor() {
    super(UserWorkspace);
  }

  async findByWorkspaceId(workspaceid) {
    return UserWorkspace.query().findOne('workspaceId', workspaceid);
  }

  async findByRole(role) {
    return UserWorkspace.query().findOne('role', role);
  }

  async createUserWorkspace(input, trx) {
    const { userId, workspaceId, role } = input;
    try {
      const userworkspace = await UserWorkspace.query(trx).insert(input);
      // await trx.commit();
      return userworkspace;
    } catch (err) {
      // await trx.rollback();
      throw err;
    }
  }
}

export const userWorkspaceService = new UserWorkspaceService();
