/* eslint-disable @typescript-eslint/no-var-requires */
exports.seed = function (knex){
  return knex('user')
    .del()
    .then(function(){
      return knex('user').insert(require('./data/user.json'))
    });
}