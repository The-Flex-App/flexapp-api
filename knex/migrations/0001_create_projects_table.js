const tableName = 'projects';

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName, function (t) {
    t.increments('id').unsigned().notNullable().primary();
    t.string('title').notNullable();
    t.text('description');
    t.string('rag').notNullable();
    t.string('period').notNullable();
    t.string('user_id').notNullable();
    t.integer('order').unsigned().notNullable();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
