import BaseModel from './base.model';

export default class User extends BaseModel {
  static tableName = 'users';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', maxLength: 36 },
      userName: { type: 'string', maxLength: 255 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      firstName: { type: 'string', minLength: 1, maxLength: 255 },
      lastName: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', minLength: 1, maxLength: 255, format: 'email' },
      workspaceId: { type: 'string' },
    },

    required: ['firstName', 'lastName', 'email'],
  };
}
