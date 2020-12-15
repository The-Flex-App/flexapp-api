const tableName = 'projects';

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName, function (t) {
    t.increments('id').unsigned().notNullable().primary();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();
    t.string('title').notNullable();
    t.text('description');
    t.string('user_id').notNullable();

    t.foreign('user_id', 'projects_fk1').references('users.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
