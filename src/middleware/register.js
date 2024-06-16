const express = require('express');
const public_users = express.Router();
const sqlite3 = require('sqlite3').verbose();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;

  // Check if fields are filled
  if (!username || !name || !password) {
    return res.status(400).send({ message: 'Name, username or password not provided.'})
  }

  // Open connection with database
  const db = new sqlite3.Database('./database.sqlite');
  
  const date = () => {
    return new Date().toLocaleString();
  }

  // Check if user already exists
  db.get("SELECT id FROM User WHERE username = ?", username, (err, row) => {
    if (row) {
      db.close();
      return res.status(409).send({ message: "User already exists." });
    }

    // If the user doesnt exist, run the query below to add user to the database. We do this within GET verb.
    db.run("INSERT INTO User (name, username, password, created_at) VALUES (?, ?, ?, ?)", 
      name.toString(), username.toString(), password.toString(), date(), (err, row) => {
      if (err) {
        console.log('here is error: ');
        console.log(err);
      } else {
        console.log('here is date: ' + date());
      }
      db.close();
      return res.status(200).json({
        "created_at": date(),
      }
      )
    })
  })
})

module.exports = public_users;
