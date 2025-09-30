const express = require("express");
const router = express.Router();


let todos = [];
let nextId = 1;


router.get("/", (req, res) => {
  res.json(todos);
});


router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Titre manquant" });

  const newTodo = { id: nextId++, title, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});


router.get("/:id", (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: "Todo non trouvé" });
  res.json(todo);
});


router.put("/:id", (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: "Todo non trouvé" });

  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});


router.delete("/:id", (req, res) => {
  const index = todos.findIndex(t => t.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Todo non trouvé" });

  todos.splice(index, 1);
  res.json({ message: "Todo supprimé" });
});

module.exports = router;
