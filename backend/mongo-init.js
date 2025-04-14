// Accounts DataBase
db = db.getSiblingDB('accounts');
use('accounts');

db.createCollection("credentials");


// Create user admin
db.createUser({
  user: 'admin',
  pwd: 'adminpassword',
  roles: [{ role: 'readWrite', db: 'accounts', collection: 'credentials' }]
});

// TODO: Créer un Modèle pour la BDD

// Indexes
db.credentials.createIndex({ email: 1 }, { unique: true });

// Create collection and docs
db.credentials.insertMany([
  { firstName: 'Dev', lastName: 'dev', email: 'dev.1@frVigilante.gouv.fr', password: '$2b$10$5jBqcbBc9Kequk827PlF3.ugBvVN0bUjYCtGW4vOTA.J4zgmwWBuS', created_at: new Date() }, // pswd: DEV1234!%

  { firstName: 'Admin', lastName: 'admin-1', email: 'admin.1@frVigilante.gouv.fr', password: '$2b$10$/QS4jDUeQbroWgZyL3xi2utJVmN7iZCwgQTSqKzwWKvaiEGs3WauS', created_at: new Date() }, // pswd: aDmin12345!
  { firstName: 'Admin', lastName: 'admin-2', email: 'admin.2@frVigilante.gouv.fr', role: 'admin', password: '$2b$10$/QS4jDUeQbroWgZyL3xi2utJVmN7iZCwgQTSqKzwWKvaiEGs3WauS', created_at: new Date() }, // pswd: aDmin12345!

  { firstName: 'Math', lastName: 'test-user', email: 'math.test@test.com', password: '$2b$10$1wSHhtnam7gEClw04wbdT.4c72AI3GNJ0hnC/kKEIxHF5l5dxgUiq', created_at: new Date() }, // pswd: MaTh1234!!user
  { firstName: 'Ray', lastName: 'test-user', email: 'ray.test@test.com', password: '$2b$10$Ghx3J/ljJ8TEU8SbpSZuCOHTOdqXoJ6ez8NfUwSKD787ETp9m83ru', created_at: new Date() }, // pswd: RayaNE1234!!user
  { firstName: 'Joao', lastName: 'test-user', email: 'joao.test@test.com', password: '$2b$10$kPjRZqkjzU2MFW6sMgwfk.GkqvwQs2wERfnzlIW4OvNy40Jg8x3d2', created_at: new Date() }, // pswd: JOao1234!!user
]);



// Maps DataBase
db = db.getSiblingDB('maps');
use('maps');

// Create Collections
db.createCollection("issues");
db.createCollection("messages");

// Create Indexes
db.messages.createIndex({ issue_id: 1 }, { unique: true });


// https://www.mongodb.com/docs/manual/reference/built-in-roles/
// Create Roles
db.createRole({ // ISSUES
  role: 'accessIssueRole',
  privileges: [
    { resource: { db: 'maps', collection: 'issues' }, actions: ['find', 'insert'] }
  ],
  roles: []
});
// db.createRole({ // VOTES
//   role: 'accessVotesRole',
//   privileges: [
//     { resource: { db: 'maps', collection: 'votes' }, actions: ['find', 'insert'] }
//   ],
//   roles: []
// });
// db.createRole({ // SOLVED VOTES
//   role: 'accessSolvedVOTESRole',
//   privileges: [
//     { resource: { db: 'maps', collection: 'solved_votes' }, actions: ['find', 'insert'] }
//   ],
//   roles: []
// });
// db.createRole({ // COMMENTS
//   role: 'accessCommentsRole',
//   privileges: [
//     { resource: { db: 'maps', collection: 'comments' }, actions: ['find', 'insert'] }
//   ],
//   roles: []
// });


// Create user issues
db.createUser({
  user: 'issue_admin',
  pwd: 'issuespassword3124',
  roles: [
    { role: 'readWrite', db: 'maps' },
    { role: 'read', db: 'accounts', collection: 'credentials'}
  ]
});


db.createUser({
  user: 'mess_admin',
  pwd: 'Messgspassword3124',
  roles: [
    { role: 'read', db: 'maps', collection: 'issues' },
    { role: 'readWrite', db: 'maps', collection: 'messages' }
  ]
});


// Create user votes
// db.createUser({
//   user: 'votes_admin',
//   pwd: 'votespassword3124',
//   roles: [
//     { role: 'accessVotesRole', db: 'maps' },
//     { role: 'accessIssueRole', db: 'maps' }
//   ]
// });

// // Create Collection and docs
// db.issues.insertMany([
//   { test: "coucou"},
//   { test: "coucou2"}
// ])


// // Create user issues
// db.createUser({
//   user: 'issue_admin',
//   pwd: 'issuespassword3124',
//   roles: [
//     { role: 'accessIssueRole', db: 'maps' }
//   ]
// });

// // Create Collection and docs
// db.issues.insertMany([
//   { test: "coucou"},
//   { test: "coucou2"}
// ])