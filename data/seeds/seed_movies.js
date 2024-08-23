/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('movies').del()
    .then(function () {
      // Inserts seed entries
      return knex('movies').insert([
        { movie_title: 'The Shawshank Redemption' },
        { movie_title: 'The Godfather' },
        { movie_title: 'The Dark Knight' }
      ]);
    });
};
