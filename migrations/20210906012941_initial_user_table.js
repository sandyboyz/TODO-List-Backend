/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const knex = require("knex");

/**
 * 
 * @param {knex} knex 
 */
exports.up = function(knex) {
  return knex.schema.createTable('user', table => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('name');
    table.string('password');
    table.integer('role');

  });
};

/**
 * 
 * @param {knex} knex 
 * @returns 
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
