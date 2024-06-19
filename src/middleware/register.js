const express = require('express');
const public_users = express.Router();
const sqlite3 = require('sqlite3').verbose();
const lib = require('../lib/lib');

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;

  if (!username || !name || !password) {
    return res.status(400).send({ message: 'Name, username or password not provided.'});
  }

  const db = new sqlite3.Database('./database.sqlite');

  db.get('SELECT id FROM User WHERE username = ?', username, (_err, row) => {
    if (row) {
      db.close();
      return res.status(409).send({ message: 'User already exists.' });
    }

    const date = lib.formatDate();

    db.run('INSERT INTO User (name, username, password, created_at) VALUES (?, ?, ?, ?)', 
      name.toString(), username.toString(), password.toString(), date, (err) => {
      if (err) {
        console.log(err);
      } else {
        db.get('SELECT id FROM User WHERE name = ? AND username = ?', name.toString(), username.toString(), (err, row) => {
          if (err) {
            console.log(err);
          } else {
            db.run('INSERT INTO UserLoginLogoutTime (login_time, user_id) VALUES (?, ?)', date, row.id, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('ok');
              }
            });
          }
        });
      }
      db.close();
      return res.status(200).json({
        'created_at': date,
      });
    });
  });
})

module.exports = public_users;
