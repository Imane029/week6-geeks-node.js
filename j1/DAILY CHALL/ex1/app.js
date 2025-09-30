const express = require("express");
const quizRouter = require("./routes/quiz");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static("public"));


app.use("/quiz", quizRouter);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
