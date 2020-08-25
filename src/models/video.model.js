import BaseModel from './base.model';
import { Model } from 'objection';

export default class Video extends BaseModel {
  static tableName = 'videos';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      creatorId: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 4000 },
      video: { type: 'string', minLength: 1, maxLength: 4000 },
      thumbnail: { type: 'string', minLength: 1, maxLength: 1000 },
      duration: { type: 'integer' },
      projectId: { type: 'integer' },
    },

    required: ['creatorId', 'projectId', 'video'],
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

    project: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/project.model`,
      join: {
        from: 'videos.projectId',
        to: 'project.id',
      },
    },
  };
}
