const express = require('express');
const public_users = express.Router();
const sqlite3 = require('sqlite3').verbose()

public_users.post("/register", (req, res) => {
  const display_name = req.body.nickname;
  const username = req.body.name;
  const password = req.body.password;

  // Check if fields are filled
  if (!username || !display_name || !password) {
    return res.status(400).send({ message: 'User, display name or password not provided.'})
  }

  // Open connection with database
  const db = new sqlite3.Database('./database.sqlite');

  // Check if user already exists
  db.get('SELECT id FROM User WHERE username = ?', username, (err, row) => {
    if (row) {
      db.close();
      return res.status(409).send({ message: "User already exists." });
    }

    // If the user doesnt exist, run the query below to add user to the database. We do this within GET verb.
    db.run("INSERT INTO User (username, display_name, password) VALUES (?, ?, ?)", username.toString(), display_name.toString(), password.toString(), (err, row) => {
      if (err) {
      } else {
      }
      db.close();
      return res.status(200).send({message: "User created"});
    })
  })
})

module.exports = public_users;
