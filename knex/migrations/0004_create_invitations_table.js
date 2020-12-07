const tableName = 'invitations';

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName, (t) => {
    t.increments('id').unsigned().notNullable().primary();
    t.dateTime('expiry_date').notNullable();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();
    t.string('user_id').notNullable();
    t.string('workspace_id').notNullable();
    // t.foreign('user_id', 'invitations_fk1').references('users.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
