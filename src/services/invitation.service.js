import BaseService from "./base.service";
import Invitation from "../models/invitation.model";
import { transaction } from "objection";
import { truncate } from "lodash";

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

  isExiredLink(expiryDate) {
    const oneDay = 1 * 24 * 60 * 60 * 1000;
    const currentDate = new Date().getTime();
    const interval = expiryDate - currentDate;
    if (interval > oneDay) {
      return true;
    }
    return false;
  }

  async validateInvite(input) {
    const { workspaceId: inputWorkspaceId, inviteId } = input;
    const invite = await this.findById(inviteId);
    if (invite) {
      const { expiryDate, workspaceId } = invite;
      const isExpiredLink = this.isExiredLink(new Date(expiryDate));
      if (workspaceId && workspaceId === inputWorkspaceId && !isExpiredLink) {
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
    return Invitation.query().findOne("id", id);
  }
}

export const invitationService = new InvitationService();
