const tableName = 'videos';

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName, function (t) {
    t.increments('id').unsigned().notNullable().primary();
    t.integer('project_id').unsigned().notNullable();
    t.integer('topic_id').unsigned().notNullable();
    t.string('user_id').notNullable();
    t.string('thumbnail');
    t.integer('duration');
    t.string('title');
    t.text('video').notNullable();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();

    // t.foreign('project_id', 'videos_fk1').references('projects.id');
    // t.foreign('topic_id', 'videos_fk2').references('topics.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName);
};
