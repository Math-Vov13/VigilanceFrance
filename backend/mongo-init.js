// Accounts DataBase
db = db.getSiblingDB('accounts');

// Create user admin
db.createUser({
  user: 'admin',
  pwd: 'adminpassword',
  roles: [{ role: 'readWrite', db: 'accounts' }]
});

// TODO: Créer un Modèle pour la BDD
// db.credentials.createIndex({ email: 1 }, "unique");

// Create collection and docs
db.credentials.insertMany([
  { firstName: 'Dev', lastName: 'dev', email: 'dev.1@fr_vigilante.gouv.fr', password: '$2b$10$5jBqcbBc9Kequk827PlF3.ugBvVN0bUjYCtGW4vOTA.J4zgmwWBuS' }, // pswd: DEV1234!%

  { firstName: 'Admin', lastName: 'admin-1', email: 'admin.1@fr_vigilante.gouv.fr', password: '$2b$10$/QS4jDUeQbroWgZyL3xi2utJVmN7iZCwgQTSqKzwWKvaiEGs3WauS' }, // pswd: aDmin12345!
  { firstName: 'Admin', lastName: 'admin-2', email: 'admin.2@fr_vigilante.gouv.fr', password: '$2b$10$/QS4jDUeQbroWgZyL3xi2utJVmN7iZCwgQTSqKzwWKvaiEGs3WauS' }, // pswd: aDmin12345!

  { firstName: 'Math', lastName: 'test-user', email: 'math.test@test.com', password: '$2b$10$1wSHhtnam7gEClw04wbdT.4c72AI3GNJ0hnC/kKEIxHF5l5dxgUiq' }, // pswd: MaTh1234!!user
  { firstName: 'Ray', lastName: 'test-user', email: 'ray.test@test.com', password: '$2b$10$Ghx3J/ljJ8TEU8SbpSZuCOHTOdqXoJ6ez8NfUwSKD787ETp9m83ru' }, // pswd: RayaNE1234!!user
  { firstName: 'Joao', lastName: 'test-user', email: 'joao.test@test.com', password: '$2b$10$kPjRZqkjzU2MFW6sMgwfk.GkqvwQs2wERfnzlIW4OvNy40Jg8x3d2' }, // pswd: JOao1234!!user
]);



// Maps DataBase
// db = db.getSiblingDB('maps');
// db.