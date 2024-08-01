const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
const sqlite3 = require('sqlite3').verbose();
const lib = require('../lib/lib');
const momentTimeZone = require('moment-timezone');


regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const db = new sqlite3.Database('./database.sqlite');

  db.get(`
    SELECT u.id, name, username, created_at, login_time
    FROM User u
    LEFT JOIN UserLoginLogoutTime ullt
    ON ullt.user_id = u.id
    WHERE username = ?
    AND password = ?
    ORDER BY ullt.id DESC`, username, password, (_err, row) => {
    if (!row) {
      db.close();
      return res.status(404).send({ message: 'Cannot login. Invalid username or password.'});
    } else {
      const date = lib.formatDate();
      // assign a login token
      let accessToken = jwt.sign(
        { data: password },
        'acccess',
        { expiresIn: 60 * 60 }
      );

      req.session.authorization = {
        accessToken, username,
      }

      const userId = row.id;

      db.run('INSERT INTO UserLoginLogoutTime (login_time, user_id) VALUES (?, ?)', date, userId, (err) => {
        if (err) {
          console.log(err);
        } else {
          db.all(`
            SELECT SUBSTRING(login_time, 0, 11) AS date, SUM(time_logged_in) AS minutes
            FROM UserLoginLogoutTime
            WHERE login_time IS NOT NULL
            AND logout_time IS NOT NULL
            AND time_logged_in IS NOT NULL
            AND date(replace(login_time, '/', '-')) < date('now', '-1 day')
            AND user_id = ${userId}
            GROUP BY date
            ORDER BY date DESC
            LIMIT 5;
            `, (err, days) => {
            if (err) {
              db.close();
              return res.status(500).send({ message: 'Could not login user. Try again.'});
            } else {
              db.close();
              const previousDay = days[0].date;

              const dateWithoutTime = lib.dateWithoutTime(previousDay);
              const rowWithDate = {
                ...row,
                login_time: dateWithoutTime,
                login_days: days
              }
              return res.status(200).json(rowWithDate);
            }
          });
        }
      })
    }
  });
})

regd_users.post('/logout', (req, res) => {
  const id = req.body.id;
  const logoutTime = lib.formatDate();

  const db = new sqlite3.Database('./database.sqlite');
  db.run(`
    UPDATE UserLoginLogoutTime
    SET logout_time = ?
    WHERE id = (SELECT id
    FROM UserLoginLogoutTime
    WHERE user_id = ?
    ORDER BY id
    DESC);`,
    logoutTime, id, (err) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: err.message });
    } else {
      db.get('SELECT login_time FROM UserLoginLogoutTime WHERE user_id = ? ORDER BY id DESC', id, (err, row) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: err.message });
        } else {
          const login = momentTimeZone.tz(row.login_time, 'YYYY/MM/DD H:mm:ss', momentTimeZone.tz.guess());
          const logout = momentTimeZone.tz(logoutTime, 'YYYY/MM/DD H:mm:ss', momentTimeZone.tz.guess());
          const diff = logout.diff(login, 'minutes');
          db.run('UPDATE UserLoginLogoutTime SET time_logged_in = ? WHERE user_id = ? AND id = (SELECT id FROM UserLoginLogoutTime WHERE user_id = ? ORDER BY id DESC)', diff, id, id, (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            } else {
              db.close();
              return res.status(200).send({message: 'Successfully logged out.'});
            }
          });
        }
      })
    }
  });
})

module.exports = regd_users;
