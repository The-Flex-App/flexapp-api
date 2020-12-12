import BaseService from './base.service';
import { userService } from './user.service';
import Invitation from '../models/invitation.model';
import { transaction } from 'objection';

class InvitationService extends BaseService {
  constructor() {
    super(Invitation);
  }

  async createInvitation(input) {
    let trx;
    try {
      trx = await transaction.start(Invitation.knex());

      const d = new Date();
      // add a day to current date
      let oneDayFromNow = d.setDate(d.getDate() + 1);
      oneDayFromNow = new Date(oneDayFromNow);
      input.expiryDate = oneDayFromNow;
      input.used = false;

      const invitation = await Invitation.query(trx).insert(input);
      await trx.commit();
      return invitation;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async editInvite(input, trx) {
    try {
      const { id } = input;
      input.used = true;
      await Invitation.query(trx).findById(id).patch(input);
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  isExiredLink(expiryDate, used) {
    const oneDay = 1 * 24 * 60 * 60 * 1000;
    const currentDate = new Date().getTime();
    const interval = expiryDate - currentDate;
    const isUsed = used === '1';
    if (interval > oneDay || isUsed) {
      return true;
    }
    return false;
  }

  async validateInvite(input) {
    const { workspaceId: inputWorkspaceId, inviteId, id } = input;
    const user = await userService.findById(id);
    const isValidUser = user && user.workspaceId !== inputWorkspaceId;
    const invite = await this.findById(inviteId);
    if (invite) {
      const { expiryDate, workspaceId, used } = invite;
      const isExpiredLink = this.isExiredLink(new Date(expiryDate), used);
      if (
        workspaceId &&
        workspaceId === inputWorkspaceId &&
        !isExpiredLink &&
        isValidUser
      ) {
        return true;
      }
    }
    return false;
  }

  async deleteInvitation(id) {
    const invitation = await this.findById(id);
    await Invitation.query().deleteById(id);
    return invitation;
  }

  async findById(id) {
    return Invitation.query().findOne('id', id);
  }
}

export const invitationService = new InvitationService();
