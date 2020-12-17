import { readFileSync } from "fs";
import { invitationService } from "../services/invitation.service";
import { userService } from "../services/user.service";

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
      const { workspaceId, userId } = input;
      const isValidUser = await userService.isValidateUser(userId, workspaceId);
      if (!isValidUser) {
        throw new Error("Invalid user");
      }
      return invitationService.createInvitation(input);
    },

    deleteInvitation: (parent, { id }, ctx, info) => {
      return invitationService.deleteInvitation(id);
    },
  },
};
