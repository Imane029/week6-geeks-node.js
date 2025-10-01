const express = require('express');
const bodyParser = require('body-parser');
const quizRoutes = require('./routes/quizRoutes');
const path = require('path');

const app = express();
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, '../public')));


app.use('/api', quizRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});
