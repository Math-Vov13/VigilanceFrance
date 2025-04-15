// Accounts DataBase
db = db.getSiblingDB('vigi_france_DB');
use('vigi_france_DB');



// Create Roles
// https://www.mongodb.com/docs/manual/reference/built-in-roles/
db.createRole({ // USERS
  role: 'accessAccountsRole',
  privileges: [
    { resource: { db: 'vigi_france_DB', collection: 'accounts' }, actions: ['find', 'insert', 'update'] }
  ],
  roles: []
});

db.createRole({ // ISSUES
  role: 'issuesRole',
  privileges: [
    { resource: { db: 'vigi_france_DB', collection: 'issues' }, actions: ['find', 'insert', 'update', 'remove'] },
    { resource: { db: 'vigi_france_DB', collection: 'messages' }, actions: ['insert', 'remove'] }
  ],
  roles: []
})

db.createRole({ // MESSAGES
  role: 'messagesRole',
  privileges: [
    { resource: { db: 'vigi_france_DB', collection: 'messages' }, actions: ['find', 'insert', 'update', 'remove'] },
    { resource: { db: 'vigi_france_DB', collection: 'issues' }, actions: ['find'] }
  ],
  roles: []
});



// Create Users
db.createUser({
  user: 'admin',
  pwd: 'adminpassword',
  roles: [{ role: 'accessAccountsRole', db: 'vigi_france_DB' }]
});

db.createUser({
  user: 'issue_admin',
  pwd: 'issuespassword3124',
  roles: [{ role: 'issuesRole', db: 'vigi_france_DB' }]
});

db.createUser({
  user: 'mess_admin',
  pwd: 'Messgspassword3124',
  roles: [{ role: 'messagesRole', db: 'vigi_france_DB' }]
});



// Create Collections
db.createCollection("issues");
db.createCollection("messages");
db.createCollection("accounts");



// Create Indexes
db.accounts.createIndex({ email: 1 }, { unique: true });
db.messages.createIndex({ issue_id: 1 }, { unique: true });




// Add sample docs
db.accounts.insertMany([
  { firstName: 'Dev', lastName: 'dev', email: 'dev.1@frVigilante.gouv.fr', password: '$2b$10$5jBqcbBc9Kequk827PlF3.ugBvVN0bUjYCtGW4vOTA.J4zgmwWBuS', created_at: new Date() }, // pswd: DEV1234!%

  { firstName: 'Admin', lastName: 'admin-1', email: 'admin.1@frVigilante.gouv.fr', password: '$2b$10$/QS4jDUeQbroWgZyL3xi2utJVmN7iZCwgQTSqKzwWKvaiEGs3WauS', created_at: new Date() }, // pswd: aDmin12345!
  { firstName: 'Admin', lastName: 'admin-2', email: 'admin.2@frVigilante.gouv.fr', role: 'admin', password: '$2b$10$/QS4jDUeQbroWgZyL3xi2utJVmN7iZCwgQTSqKzwWKvaiEGs3WauS', created_at: new Date() }, // pswd: aDmin12345!

  { firstName: 'Math', lastName: 'test-user', email: 'math.test@test.com', password: '$2b$10$1wSHhtnam7gEClw04wbdT.4c72AI3GNJ0hnC/kKEIxHF5l5dxgUiq', created_at: new Date() }, // pswd: MaTh1234!!user
  { firstName: 'Ray', lastName: 'test-user', email: 'ray.test@test.com', password: '$2b$10$Ghx3J/ljJ8TEU8SbpSZuCOHTOdqXoJ6ez8NfUwSKD787ETp9m83ru', created_at: new Date() }, // pswd: RayaNE1234!!user
  { firstName: 'Joao', lastName: 'test-user', email: 'joao.test@test.com', password: '$2b$10$kPjRZqkjzU2MFW6sMgwfk.GkqvwQs2wERfnzlIW4OvNy40Jg8x3d2', created_at: new Date() }, // pswd: JOao1234!!user
]);



// // Maps

// // Create Collections
// db.createCollection("issues");
// db.createCollection("messages");

// // Create Indexes
// db.messages.createIndex({ issue_id: 1 }, { unique: true });


// // https://www.mongodb.com/docs/manual/reference/built-in-roles/
// // Create Roles
// db.createRole({ // ISSUES
//   role: 'accessIssueRole',
//   privileges: [
//     { resource: { collection: 'issues' }, actions: ['find', 'insert'] }
//   ],
//   roles: []
// });



// // Create user issues
// db.createUser({
//   user: 'issue_admin',
//   pwd: 'issuespassword3124',
//   roles: [
//     { role: 'readWrite', db: 'vigi_france_DB', collection: 'issues' },
//     { role: 'read', db: 'vigi_france_DB', collection: 'accounts' }
//   ]
// });


// db.createUser({
//   user: 'mess_admin',
//   pwd: 'Messgspassword3124',
//   roles: [
//     { role: 'read', db: 'vigi_france_DB', collection: 'issues' },
//     { role: 'read', db: 'vigi_france_DB', collection: 'accounts' },
//     { role: 'readWrite', db: 'vigi_france_DB', collection: 'messages' }
//   ]
// });