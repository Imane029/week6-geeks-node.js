const express = require("express");
const path = require("path");
const router = express.Router();


const emojis = ["😀", "🎉", "🌟", "🎈", "👋"];


router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


router.post("/greet", (req, res) => {
  const { name, emoji } = req.body;
  if (!name || !emoji) {
    return res.send("Erreur : nom ou emoji manquant !");
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Emoji Greeting</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="container">
        <h1>Bonjour, ${name}! ${emoji}</h1>
        <a href="/">Retour</a>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
