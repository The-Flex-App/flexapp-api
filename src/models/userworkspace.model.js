import BaseModel from './base.model';
import { Model } from 'objection';

export default class UserWorkspace extends BaseModel {
  static tableName = 'users_workspace';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      userId: { type: 'string', maxLength: 36 },
      workspaceId: { type: 'string' },
    },

    required: ['userId', 'workspaceId'],
  };

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user.model`,
      join: {
        from: 'users_workspace.userId',
        to: 'users.id',
      },
    },
  };
}
