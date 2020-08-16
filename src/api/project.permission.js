import { allow } from 'graphql-shield';

export const permissions = {
  Query: {
    projectById: allow,

    projects: allow,
  },
};
