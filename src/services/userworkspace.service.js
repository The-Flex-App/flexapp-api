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

  // async createUserWorkspace(){
    // user work space creation code will go here 
  // }
}

export const userWorkspaceService = new UserWorkspaceService();
