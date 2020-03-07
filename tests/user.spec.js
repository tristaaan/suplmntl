const assert = require('assert');
const db = require('../server/database');

describe('users', function() {

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

  // before(function(done) {
  //   done();
  // });

  describe('valid calls', function() {
    it('creates users', function(done) {
      db.addUser(user1)
        .then((resp) => {
          assert.strict.equal(resp.username, user1.username);
          assert.strict.equal(resp.email, user1.email);
          user1._id = resp._id;
          done();
        })
        .catch(done);
    });

    it('gets user by id', function(done) {
      db.getUserById(user1._id)
        .then((resp) => {
          assert.strict.equal(resp.username, user1.username);
          done();
        })
        .catch(done);
    });

    it('gets user by name', function(done) {
      db.getUserByName(user1.username)
        .then((resp) => {
          assert.strict.equal(resp._id.toString(), user1._id.toString());
          done();
        })
        .catch(done);
    });

    it('updates user email', function(done) {
      const newEmail = 'mulder@fbi.gov';
      db.updateUserEmail(user1._id, newEmail)
        .then((resp) => {
          assert.strict.equal(resp.email, newEmail);
          user1.email = newEmail;
          done();
        })
        .catch(done);
    });

    it('updates user password', function(done) {
      const newPass = 'qwerty';
      db.updateUserPassword(user1._id, user1.password, newPass)
        .then((resp) => {
          done();
        })
        .catch(done);
    });

    it('sets email reset token', function(done) {
      db.setResetTokenForEmail(user1.email)
        .then((resp) => {
          console.log();
          assert(resp.passwordResetToken);
          assert(resp.passwordResetExpires);
          user1.token = resp.passwordResetToken;
          user1.pw = resp.pw;
          done();
        })
        .catch(done);
    });

    it('resets password with token', function(done) {
      db.resetPasswordForToken('zxcvb', user1.token)
        .then((resp) =>{
          assert.strict.notEqual(user1.pw, resp.pw);
          user1.pw = resp.pw;
          done();
        })
        .catch(done);
    });
  });

  // describe('malicious calls', function() {

  // });

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
});
