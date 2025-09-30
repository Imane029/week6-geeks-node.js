const express = require("express");
const router = express.Router();


let posts = [];
let currentId = 1;


router.get("/", (req, res) => {
  res.json(posts);
});


router.get("/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post non trouvé" });
  res.json(post);
});


router.post("/", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Titre et contenu requis" });

  const newPost = {
    id: currentId++,
    title,
    content,
    timestamp: new Date()
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});


router.put("/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post non trouvé" });

  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Titre et contenu requis" });

  post.title = title;
  post.content = content;
  res.json(post);
});

router.delete("/:id", (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Post non trouvé" });

  posts.splice(index, 1);
  res.json({ message: "Post supprimé avec succès" });
});

module.exports = router;
