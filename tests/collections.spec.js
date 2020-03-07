const assert = require('assert');
const db = require('../server/database');

describe('collections', function() {

  const user1 = {
    username: 'user1',
    email: 'sample@web.com',
    password: '123abc'
  };

  const user2 = {
    username: 'user2',
    email: 'bogus@web.com',
    password: '123abc'
  };

  let sampleCollection = {
    name: 'sample'
  };

  let forkCollection1;
  let forkCollection2;

  // before all, add two users one owns the collection.
  before(function(done) {
    const addUsers = [
      db.addUser(user1),
      db.addUser(user2)
    ];

    Promise.all(addUsers)
      .then((resp) => {
        user1._id = resp[0]._id;
        user2._id = resp[1]._id;

        sampleCollection.owner = {
          _id: user1._id,
          username: user1.username
        };
        done();
      })
      .catch((err) => {
        db.getUserByName(user1.username)
          .then((resp) => {
            user1._id = resp._id;
            sampleCollection.owner = {
              _id: user1._id,
              username: user1.username
            };
            return db.getUserByName(user2.username);
          })
          .then((resp) => {
            user2._id = resp._id;
            done();
          })
          .catch(done);
      });
  });

  describe('valid calls', function() {
    it('creates collections', function(done) {
      db.createCollection(sampleCollection)
        .then((resp) => {
          assert.strict.equal(resp.name, 'sample');
          sampleCollection._id = resp._id;
          sampleCollection.postId = resp.postId;
          return db.getCollections(user1.username);
        })
        .then((resp) => {
          assert.strict.equal(resp.length, 1);
          done();
        })
        .catch(done);
    });

    it('gets collection by id', function(done) {
      db.getCollectionByPostId(sampleCollection.postId)
        .then((resp) => {
          assert.strict.equal(resp._id.toString(), sampleCollection._id.toString());
          done();
        })
        .catch(done);
    });

    it('updates collections', function(done) {
      const updated = { ...sampleCollection };
      updated.name = 'new name';
      db.updateCollection(updated, user1._id)
        .then((resp) => {
          assert.strict.equal(resp.name, updated.name);
          sampleCollection._id = resp._id;
          sampleCollection.name = resp.name;
          done();
        })
        .catch(done);
    });

    it('forks collections', function(done) {
      const {_id, username} = user2;
      db.forkCollection(sampleCollection._id, { _id, username })
        .then((resp) => {
          assert.strict.equal(resp.name, `fork of ${sampleCollection.name}`);
          assert.strict.equal(resp.forkOf._id.toString(), sampleCollection._id.toString());
          forkCollection1 = { ...resp };
          return db.getCollection(sampleCollection._id);
        })
        .then((resp) => {
          assert.strict.equal(resp.forks, 1);
          return db.forkCollection(sampleCollection._id, { _id, username });
        })
        .then((resp) => {
          forkCollection2 = { ...resp._doc };
          done();
        })
        .catch(done);
    });

    it('deletes forked collection and updates parent', function(done) {
      db.deleteCollection(forkCollection2._id, user2._id)
        .then((resp) => {
          return db.getCollections(user1.username);
        })
        .then((resp) => {
          assert.strict.equal(resp[0].forks, 1);
          done();
        })
        .catch(done);
    });

    it('deletes collection and updates forks', function(done) {
      db.deleteCollection(sampleCollection._id, user1._id)
        .then((resp) => {
          return db.getCollections(user1.username);
        })
        // assert collection was deleted
        .then((resp) => {
          assert.strict.equal(resp.length, 0);
          return db.getCollections(user2.username);
        })
        // removes fork information from forks
        .then((resp) => {
          assert.strict.equal(resp.length, 1);
          assert.strict.equal(resp[0].forkOf, null);
          done();
        })
        .catch(done);
    });
  });

  describe('malicious calls', function() {
    before(function(done) {
      db.createCollection(sampleCollection)
        .then((resp) => {
          sampleCollection._id = resp._id;
          sampleCollection.postId = resp.postId;
          done();
        })
        .catch(done);
    });

    it('does not allow non-owner to update collection', function(done) {
      const updated = { ...sampleCollection };
      updated.name = 'new name';
      db.updateCollection(updated, user2._id)
        .then((resp) => {
          assert(false);
          done();
        })
        .catch((err) => {
          assert.strict.equal(err.message, 'unauthorized');
          done();
        });
    });

    it('does not allow non-owner to delete collection', function(done) {
      db.deleteCollection(sampleCollection._id, user2._id)
        .then((resp) => {
          assert(false);
          done();
        })
        .catch((err) => {
          assert.strict.equal(err.message, 'unauthorized');
          done();
        });
    });
  });

  // after all, delete both users.
  after(function(done) {
    const deleteUsers = [
      db.deleteUser(user1._id),
      db.deleteUser(user2._id)
    ];
    Promise.all(deleteUsers)
      .then((resp) => { done(); })
      .catch(done);
  })
})