import { knexSnakeCaseMappers, Model } from 'objection';
import Knex from 'knex';
import configuration from '../../knex/knex';

export function initDatabase() {
  const databaseClient = Knex({
    ...configuration,
    ...knexSnakeCaseMappers(),
  });

  Model.knex(databaseClient);
}

export async function closeDatabase() {
  await Model.knex().destroy();
}
