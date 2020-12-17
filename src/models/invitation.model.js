import BaseModel from './base.model';
import { Model } from 'objection';

export default class Invitation extends BaseModel {
  static tableName = 'invitations';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', maxLength: 36 },
      expiryDate: { type: 'string', format: 'date-time' },
      userId: { type: 'string', maxLength: 36 },
      used: { type: 'boolean' },
      workspaceId: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },

    required: ['workspaceId'],
  };

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user.model`,
      join: {
        from: 'invitations.userId',
        to: 'users.id',
      },
    },
  };
}
