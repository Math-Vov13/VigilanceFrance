
const jwt = require('jsonwebtoken');

const JWT_TOKEN = process.env.ACCESSTOKEN_SECRET_KEY; 

const payload = {
  userId: '123456',
  username: 'testuser',
  role: 'user'
};

const token = jwt.sign(payload, JWT_TOKEN, { expiresIn: '24h' });
console.log('Token JWT pour les tests:');
console.log(token);