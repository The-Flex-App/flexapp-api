import { readFileSync } from "fs";
import { invitationService } from "../services/invitation.service";

export const typeDefs = readFileSync(
  `${__dirname}/invitation.api.graphql`,
  "utf8"
);

export const resolvers = {
  Query: {
    invitationById: (parent, { id }, ctx, info) => {
      return invitationService.findById(id);
    },
  },

  Mutation: {
    createInvitaton: async (parent, { input }, ctx, info) => {
      if (await invitationService.findById(input.id)) {
        throw new Error("Invitation already exists");
      }
      return invitationService.createInvitation(input);
    },

    deleteInvitation: (parent, { id }, ctx, info) => {
      return invitationService.deleteInvitation(id);
    },
  },
};
