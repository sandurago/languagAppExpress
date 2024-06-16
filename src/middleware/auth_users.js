const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
const sqlite3 = require('sqlite3').verbose();
const lib = require('../lib/lib');


regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // create db connection
  const db = new sqlite3.Database('./database.sqlite');

  //check if user is in db
  db.get('SELECT u.id, name, username, created_at, login_time FROM User u, UserLoginTime ul WHERE username = ? AND password = ? AND ul.user_id = u.id ORDER BY ul.id DESC', username, password, (err, row) => {
    if (!row) {
      db.close();
      return res.status(404).send({ message: 'Cannot login. Invalid username or password.'})
    } else {
      const date = lib.date();
      // assign a login token
      let accessToken = jwt.sign(
        { data: password },
        'acccess',
        { expiresIn: 60 * 60 }
      );

      req.session.authorization = {
        accessToken, username
      }

      const userId = row.id;
      db.run('INSERT INTO UserLoginTime (login_time, user_id) VALUES (?, ?)', date, userId, (err) => {
        if (err) {
          db.close();
          console.log(err);
        } else {
          db.close();
          return res.status(200).json(row)
        }
      })
    }
  });
});

regd_users.post('/logout', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const username = req.body.username;
  console.log(id + ' ' + name + ' ' + username);
  console.log(name);
  console.log(username);
  const date = lib.date();

  const db = new sqlite3.Database('./database.sqlite');

  db.get('SELECT id, name, username FROM User WHERE id = ? AND name = ? AND username = ?', id, name, username, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      const userId = row.id;
      db.run('INSERT INTO UserLogoutTime (logout_time, user_id) VALUES (?, ?)', date, userId, (err) => {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).send({message: 'Successfully logged out.'});
        }
      })
    }
  });
})

module.exports = regd_users;
