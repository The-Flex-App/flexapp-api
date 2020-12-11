const tableName = 'users';

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName, (t) => {
    t.uuid('id').notNullable().primary();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();
    t.string('user_name').notNullable();
    t.string('first_name').notNullable();
    t.string('last_name').notNullable();
    t.string('email').notNullable();
    t.string('workspace_id').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
