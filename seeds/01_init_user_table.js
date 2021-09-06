/* eslint-disable @typescript-eslint/no-var-requires */
exports.seed = function (knex){
  return knex('users')
    .del()
    .then(function(){
      return knex('users').insert(require('./data/user.json'))
    });
}