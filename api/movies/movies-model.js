const db = require('../../data/db-config')

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}

function getAll() {
  return db('movies')
}

function getById(id) {
  return db('movies').where('id', id).first()
}

async function insert(movie) {
  return await db('movies')
    .insert(movie)
    .then(([id]) => {
      return db('movies').where('id', id).first()
    })
}

async function update(id, changes) {
    return await db('movies')
      .where('id', id)
      .update(changes)
      .then((count) => {
        return count > 0 ? db('movies').where('id', id).first() : null
      })
  }
  
  function remove(id) {
    return db('movies')
      .where('id', id)
      .del()
      .then((count) => {
        return count > 0 ? id : null
      })
  }
