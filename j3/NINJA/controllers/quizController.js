const db = require('../config/db');


exports.getQuestion = async (req, res) => {
  const id = req.params.id;
  try {
    const question = await db('questions').where('id', id).first();
    if (!question) return res.json(null);

    const options = await db('questions_options as qo')
      .join('options as o', 'qo.option_id', 'o.id')
      .where('qo.question_id', id)
      .select('o.id', 'o.option_text');

    res.json({ ...question, options });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkAnswer = async (req, res) => {
  const { questionId, answerId } = req.body;
  try {
    const question = await db('questions').where('id', questionId).first();
    const correct = question.correct_answer === parseInt(answerId);
    res.json({ correct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
