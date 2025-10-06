const express = require('express');
const path = require('path');
const usersRouter = require('./routes/users');

const app = express();
const PORT = 3000;


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/users', usersRouter);


app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Register at: http://localhost:${PORT}/register`);
    console.log(`Login at: http://localhost:${PORT}/login`);
});