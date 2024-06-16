const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const known_users = require('./src/middleware/auth_users.js');
const all_users = require('./src/middleware/register.js');
const verbs = require('./src/routes/verbRoutes.js');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Everything with /user is going through this middleware
//session is a middleware that helps to store user activity
app.use("/user", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true,
}))

// Everything that goes through /user/:id goes through authentication
app.get("/user/:id", (req, res, next) => {
  if (req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
      }
    })
  }
})



const port = 5000;

app.use("/user", known_users);

app.use("/user", all_users);

app.use('/verbs', verbs);

app.listen(port, () => console.log("server is running on port " + port));
