import BaseModel from './base.model';
import { Model } from 'objection';

export default class Project extends BaseModel {
  static tableName = 'projects';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      creatorId: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 4000 },
    },

    required: ['creatorId', 'title'],
  };

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user.model`,
      join: {
        from: 'projects.creatorId',
        to: 'users.id',
      },
    },
  };
}