const express = require('express');
const app = express();
const userRoutes = require('./server/routes/userRoutes');

app.use(express.json());


app.use('/api/users', userRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
