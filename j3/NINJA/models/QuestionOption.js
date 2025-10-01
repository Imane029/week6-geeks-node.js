const db = require('../config/db');

class QuestionOption {
  static async create(questionId, optionId) {
    return db('questions_options').insert({ question_id: questionId, option_id: optionId });
  }
}

module.exports = QuestionOption;
