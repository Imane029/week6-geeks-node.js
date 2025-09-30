const db = require('../config/db');

const createUser = async (user, hashedPassword) => {
  
  return db.transaction(async trx => {
    const [userId] = await trx('users').insert(user).returning('id');
    await trx('hashpwd').insert({ username: user.username, password: hashedPassword });
    return userId;
  });
};

const getAllUsers = () => db('users').select('*');
const getUserById = (id) => db('users').where({ id }).first();
const getHashedPassword = (username) => db('hashpwd').where({ username }).first();
const updateUser = (id, data) => db('users').where({ id }).update(data).returning('*');

module.exports = { createUser, getAllUsers, getUserById, getHashedPassword, updateUser };
