const express = require('express');
const public_users = require(express.Router);
const sqlite3 = require('sqlite3').verbose()

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const display_name = req.body.display_name;
  const password = req.body.password;

  // Check if field are filled
  if (!username || !display_name || !password) {
    return res.status(400).send({ message: "User, display name or password not provided." })
  }

  const db = new sqlite3.Database('./database.sqlite');

  db.get('SELECT id FROM User WHERE username = ?', username, (err, row) => {
    if (row) {
      db.close();
      return res.status(409).send({ message: "User already exists." });
    }
  })
})
