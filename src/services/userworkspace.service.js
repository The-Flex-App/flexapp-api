import BaseService from './base.service';
import UserService, { userService } from './user.service';
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
    try {
      const userworkspace = await UserWorkspace.query(trx).insert(input);
      return userworkspace;
    } catch (err) {
      throw err;
    }
  }

  async removeUserWorkspace(input) {
    const { userId, workspaceId, ownerUserId } = input;
    await UserWorkspace.query()
      .delete()
      .where('user_id', userId)
      .where('role', 'member')
      .where('workspace_id', workspaceId);

    return await userService.getUserInfo(ownerUserId);
  }
}

export const userWorkspaceService = new UserWorkspaceService();
