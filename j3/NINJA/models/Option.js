const db = require('../config/db');

class Option {
  static async getByQuestionId(questionId) {
    return db('questions_options as qo')
      .join('options as o', 'qo.option_id', 'o.id')
      .where('qo.question_id', questionId)
      .select('o.id', 'o.option_text');
  }
}

module.exports = Option;
