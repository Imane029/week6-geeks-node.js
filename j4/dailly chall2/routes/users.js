const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = path.join(__dirname, '..', 'users.json');
const SALT_ROUNDS = 10;


async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
       
        if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
            await fs.writeFile(USERS_FILE, '[]', 'utf8'); 
            return [];
        }
        console.error("Error reading users file:", error);
        throw new Error("Internal Server Error: Could not read user data.");
    }
}


async function writeUsers(users) {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing users file:", error);
        throw new Error("Internal Server Error: Could not save user data.");
    }
}


router.post('/register', async (req, res) => {
    const { name, lastName, email, username, password } = req.body;

  
    if (!name || !lastName || !email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required for registration.' });
    }

    try {
        const users = await readUsers();

        
        const usernameExists = users.some(user => user.username === username);
        
        const passwordExists = users.some(user => user.password === password); 

        if (usernameExists || passwordExists) {
            return res.status(409).json({
                message: 'Username or password already exists. Please choose another one.'
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = {
            id: uuidv4(),
            name,
            lastName,
            email,
            username,
            password: hashedPassword 
        };

        users.push(newUser);
        await writeUsers(users);

        res.status(201).json({ 
            message: `User ${username} registered successfully! Welcome ${name}.` 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required for login.' });
    }

    try {
        const users = await readUsers();
        const user = users.find(u => u.username === username);

        
        if (!user) {
            return res.status(401).json({ 
                message: 'You are not registered. Please sign up.' 
            });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.status(200).json({ 
                message: `User ${username} logged in successfully! Welcome back ${user.name}.` 
            });
        } else {
           
            return res.status(401).json({ 
                message: 'You are not registered. Please sign up.' 
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await readUsers();
      
        const safeUsers = users.map(({ password, ...rest }) => rest); 
        res.status(200).json(safeUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const users = await readUsers();
        const user = users.find(u => u.id === req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        
        const { password, ...safeUser } = user; 
        res.status(200).json(safeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        let users = await readUsers();
        const { id } = req.params;
        const index = users.findIndex(u => u.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'User not found for update.' });
        }

        const updatedData = req.body;
       
        delete updatedData.id;
        if (updatedData.password) {
            
            updatedData.password = await bcrypt.hash(updatedData.password, SALT_ROUNDS);
        }

        users[index] = { 
            ...users[index], 
            ...updatedData 
        };

        await writeUsers(users);

        const { password, ...safeUser } = users[index];

        res.status(200).json({ message: `User ${id} updated successfully.`, user: safeUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;