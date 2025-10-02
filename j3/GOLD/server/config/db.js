const knex = require("knex");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./todo.db"  
  },
  useNullAsDefault: true
});


db.schema.hasTable("tasks").then(exists => {
  if (!exists) {
    return db.schema.createTable("tasks", table => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.boolean("completed").defaultTo(false);
    });
  }
});

module.exports = db;
