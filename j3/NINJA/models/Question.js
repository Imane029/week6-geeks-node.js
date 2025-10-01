const db = require('../config/db');

class Question {
  static async getById(id) {
    return db('questions').where('id', id).first();
  }
}

module.exports = Question;
