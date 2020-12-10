import BaseService from "./base.service";
import Invitation from "../models/invitation.model";
import { transaction } from "objection";

class InvitationService extends BaseService {
  constructor() {
    super(Invitation);
  }

  async createInvitation(input) {
    let trx;
    try {
      trx = await transaction.start(Invitation.knex());

      let date = new Date();
      // add a day to current date
      input.expiryDate = date.setDate(date.getDate() + 1).ISOToString();

      const invitation = await Invitation.query(trx).insert(input);
      await trx.commit();
      return invitation;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
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
