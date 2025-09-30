const express = require("express");
const todoRouter = require("./routes/todos");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static("public"));


app.use("/api/todos", todoRouter);

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
