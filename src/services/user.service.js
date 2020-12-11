import BaseService from "./base.service";
import { userWorkspaceService } from "./userworkspace.service";
import User from "../models/user.model";
import { compare, hash } from "bcrypt";
import { transaction } from "objection";
import { UserInputError } from "apollo-server-express";
import { invitationService } from "./invitation.service";

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

  async getUserInfo(userid) {
    const ownerInfo = await User.query().findOne("id", userid);
    const workspaceId = ownerInfo.workspaceId;

    const ownerWorkspaceInfo = await User.query()
      .select(
        "users.id",
        "users.first_name",
        "users.last_name",
        "users.email",
        "userworkspace.role",
        "users.user_name"
      )
      .innerJoin(
        "users_workspace as userworkspace",
        "users.id",
        "userworkspace.user_id"
      )
      .where("userworkspace.workspace_id", workspaceId)
      .where("userworkspace.role", "member");

    const memberWorkspaceInfo = await User.query()
      .select(
        "users.id",
        "users.first_name",
        "users.last_name",
        "users.email",
        "userworkspace.role",
        "userworkspace.user_id",
        "userworkspace.workspace_id"
      )
      .innerJoin(
        "users_workspace as userworkspace",
        "users.workspace_id",
        "userworkspace.workspace_id"
      )
      .where("userworkspace.user_id", userid)
      .where("userworkspace.role", "member");

    const userInfo = { ...ownerInfo, ownerWorkspaceInfo, memberWorkspaceInfo };

    return userInfo;
  }

  async createUser(input) {
    let trx;
    try {
      trx = await transaction.start(User.knex());
      const { id, workspaceId, inviteId } = input;
      const existingUser = this.findById(id);
      const userId = input.id;
      // invitation flow for a member user
      if (existingUser && workspaceId && inviteId) {
        const workspaceinput = { userId, workspaceId, role: "member" };
        const invitationDetails = { id: parseInt(inviteId), workspaceId };
        await userWorkspaceService.createUserWorkspace(workspaceinput, trx);
        await invitationService.editInvite(invitationDetails, trx);
      } else {
        // normal user flow
        const userWorkspaceId = "ws" + userId;
        input.workspaceId = userWorkspaceId;
        await User.query(trx).insert(input);
        const role = "owner";
        const workspaceinput = { userId, workspaceId: userWorkspaceId, role };
        await userWorkspaceService.createUserWorkspace(workspaceinput, trx);
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
        throw new UserInputError("Email address exists!");
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
    return User.query().findOne("email", email);
  }

  async findById(id) {
    return User.query().findOne("id", id);
  }
}

export const userService = new UserService();
