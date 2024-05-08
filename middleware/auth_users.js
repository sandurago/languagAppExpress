const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
const sqlite3 = require('sqlite3').verbose();


regd_users.post("/login", (req, res) => {
  const username = req.body.nickname;
  const password = req.body.password;

  // create db connection
  const db = new sqlite3.Database('./database.sqlite');

  //check if user is in db
  db.get('SELECT username, password FROM User WHERE username = ? AND password = ?', username, password, (err, row) => {
    if (!row) {
      db.close();
      return res.status(404).send({ message: "Cannot login. Invalid username or password."})
    } else {
      // assign a login token
      let accessToken = jwt.sign(
        { data: password },
        'acccess',
        { expiresIn: 60 * 60 }
      );

      // what does it do?
      req.session.authorization = {
        accessToken, username
      }

      return res.status(200).send({ message: "User successfully logged in." })
    }
  })
})

module.exports = regd_users;
