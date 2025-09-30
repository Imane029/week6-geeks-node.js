const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { email, username, first_name, last_name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    const userId = await User.createUser({ email, username, first_name, last_name }, hashedPassword);
    res.status(201).json({ message: 'Utilisateur créé', userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userHash = await User.getHashedPassword(username);
    if (!userHash) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, userHash.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    res.json({ message: 'Connexion réussie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const [updatedUser] = await User.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getAll, getById, update };
