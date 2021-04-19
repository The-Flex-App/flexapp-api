import BaseModel from './base.model';
import { Model } from 'objection';

export default class Topic extends BaseModel {
  static tableName = 'topics';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      userId: { type: 'string', maxLength: 36 },
      projectId: { type: 'integer' },
      title: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['title', 'projectId'],
  };

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/project.model`,
      join: {
        from: 'topics.projectId',
        to: 'projects.id',
      },
    },
  };
}
