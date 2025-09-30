const express = require("express");
const path = require("path");
const greetRouter = require("./routes/greet");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // servir fichiers statiques
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Router
app.use("/", greetRouter);

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
