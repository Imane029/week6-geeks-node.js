const express = require("express");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(express.json());


app.use("/api", todoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
