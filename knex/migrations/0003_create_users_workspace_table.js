const tableName = 'users_workspace';

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName, (t) => {
    t.increments('id').unsigned().notNullable().primary();
    t.string('user_id').notNullable();
    t.string('workspace_id').notNullable();
    t.string('role').notNullable();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();

    //  t.foreign('user_id', 'users_workspace_fk1').references('users.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
