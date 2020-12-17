import BaseModel from './base.model';
import { Model } from 'objection';

export default class Project extends BaseModel {
  static tableName = 'projects';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      userId: { type: 'string', maxLength: 36 },
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 4000 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },

    required: ['userId', 'title'],
  };

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user.model`,
      join: {
        from: 'projects.userId',
        to: 'users.id',
      },
    },
  };
}
