const Todo = require("../models/todoModel");

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.getAll();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.getById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo non trouvé" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Titre requis" });

    await Todo.create({ title, completed: false });
    res.status(201).json({ message: "Todo créé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updated = await Todo.update(req.params.id, { title, completed });

    if (!updated) return res.status(404).json({ error: "Todo non trouvé" });
    res.json({ message: "Todo mis à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Todo non trouvé" });
    res.json({ message: "Todo supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
