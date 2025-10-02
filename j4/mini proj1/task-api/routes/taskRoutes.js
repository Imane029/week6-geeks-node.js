const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const filePath = "./tasks.json";

const readTasks = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};


const writeTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};


router.get("/", (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Erreur lecture des tâches" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Erreur lecture des tâches" });
  }
});

router.post("/", (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Titre requis" });

    const tasks = readTasks();
    const newTask = { id: uuidv4(), title, completed: false };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Erreur ajout tâche" });
  }
});


router.put("/:id", (req, res) => {
  try {
    const { title, completed } = req.body;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

    if (taskIndex === -1) return res.status(404).json({ error: "Tâche non trouvée" });

    if (title !== undefined) tasks[taskIndex].title = title;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } catch (err) {
    res.status(500).json({ error: "Erreur mise à jour tâche" });
  }
});


router.delete("/:id", (req, res) => {
  try {
    const tasks = readTasks();
    const newTasks = tasks.filter((t) => t.id !== req.params.id);

    if (newTasks.length === tasks.length) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    writeTasks(newTasks);
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression tâche" });
  }
});

module.exports = router;
