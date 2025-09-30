const express = require("express");
const postsRouter = require("./routes/posts");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
