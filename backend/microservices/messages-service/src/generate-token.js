
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'scecretcte_ckeyekeykeykey'; 

const payload = {
  userId: '123456',
  username: 'testuser',
  role: 'user'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
console.log('Token JWT pour les tests:');
console.log(token);