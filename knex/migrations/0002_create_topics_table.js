const tableName = 'topics';

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName, function (t) {
    t.increments('id').unsigned().notNullable().primary();
    t.string('project_id').notNullable();
    t.string('user_id').notNullable();
    t.string('title').notNullable();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
