const tableName = 'videos';

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName, function (t) {
    t.increments('id').unsigned().notNullable().primary();
    t.integer('creator_id').unsigned().notNullable();
    t.integer('project_id').unsigned().notNullable();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();
    t.string('thumbnail');
    t.integer('duration');
    t.string('title');
    t.text('video').notNullable();

    t.foreign('creator_id', 'videos_fk1').references('users.id');
    t.foreign('project_id', 'videos_fk2').references('projects.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
