import BaseService from './base.service';
import { userWorkspaceService } from './userworkspace.service';
import User from '../models/user.model';
import { compare, hash } from 'bcrypt';
import { transaction } from 'objection';
import { UserInputError } from 'apollo-server-express';
import { invitationService } from './invitation.service';
import { v4 as uuidv4 } from 'uuid';

const HASH_ROUNDS = 12;

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  async login(email, password) {
    const user = await this.findByEmail(email);

    if (!user) {
      return;
    }

    if (!(await compare(password, user.password))) {
      return;
    }

    delete user.password;

    return user;
  }

  async getUserInfo(userid, workspaceid) {
    const ownerInfo = await this.findById(userid);
    const workspaceId = workspaceid || ownerInfo.workspaceId;

    // when user is on others workspace
    ownerInfo.role =
      workspaceid && workspaceid !== ownerInfo.workspaceId ? 'member' : 'owner';

    const workspaceMembers = await User.query()
      .select('users.*')
      .innerJoin(
        'users_workspace as userworkspace',
        'users.id',
        'userworkspace.user_id'
      )
      .where('userworkspace.workspace_id', workspaceId)
      .where('userworkspace.role', 'member');

    const workspaces = await User.query()
      .select('users.*')
      .innerJoin(
        'users_workspace as userworkspace',
        'users.workspace_id',
        'userworkspace.workspace_id'
      )
      .where('userworkspace.user_id', userid)
      .where('userworkspace.role', 'member');

    const userInfo = {
      ...ownerInfo,
      workspaceMembers,
      workspaces,
    };

    return userInfo;
  }

  async createUser(input) {
    let trx;
    try {
      trx = await transaction.start(User.knex());
      const { id: userId, workspaceId, inviteId } = input;

      const existingUser = await this.findById(userId);

      // normal create user workflow
      if (!existingUser) {
        const userWorkspaceId = uuidv4();
        input.workspaceId = userWorkspaceId;
        delete input.inviteId;
        await User.query(trx).insert(input);
        const role = 'owner';
        const workspaceinput = { userId, workspaceId: userWorkspaceId, role };
        await userWorkspaceService.createUserWorkspace(workspaceinput, trx);
      }

      // invitation flow for a member user
      if (workspaceId && inviteId) {
        const workspaceinput = { userId, workspaceId, role: 'member' };
        const invitationDetails = { id: inviteId, workspaceId };
        await userWorkspaceService.createUserWorkspace(workspaceinput, trx);
        await invitationService.editInvite(invitationDetails, trx);
      }

      await trx.commit();
      const userInfo = await this.getUserInfo(userId);
      return userInfo;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async editUser(id, editUserReq) {
    if (!editUserReq.fullName) {
      delete editUserReq.fullName;
    }
    if (!editUserReq.email) {
      delete editUserReq.email;
    }

    if (editUserReq.email) {
      const user = await this.findByEmail(editUserReq.email);

      if (user && user.id !== id) {
        throw new UserInputError('Email address exists!');
      }
    }

    await User.query().findById(id).patch(editUserReq);

    return this.findById(id);
  }

  async deleteUser(id) {
    const user = await this.findById(id);

    await User.query().deleteById(id);

    return user;
  }

  async isValidateUser(userId, workspaceId) {
    const user = await this.findById(userId);
    console.log(user);
    if (user.workspaceId === workspaceId) {
      return true;
    }
    return false;
  }

  async changePassword(id, password, newPassword) {
    const user = await this.findById(id);

    if (!(await compare(password, user.password))) {
      return false;
    }

    newPassword = await hash(newPassword, HASH_ROUNDS);

    await User.query().findById(id).patch({
      password: newPassword,
    });

    return true;
  }

  async findByEmail(email) {
    return User.query().findOne('email', email);
  }

  async findById(id) {
    return await User.query().findOne('id', id);
  }

  async findByWorkspaceId(workspaceId) {
    return await User.query().findOne('workspaceId', workspaceId);
  }
}

export const userService = new UserService();
