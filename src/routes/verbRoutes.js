const express = require('express');
const verbs = express.Router();
const sqlite3 = require('sqlite3').verbose();

verbs.get('/verbslist', (_req, res) => {
  const db = new sqlite3.Database('database.sqlite');

  db.all(
    `SELECT Verb.id, Verb.name, Verb.translation, ConjugationPresent.je, ConjugationPresent.tu, ConjugationPresent.ilelle, ConjugationPresent.nous, ConjugationPresent.vous, ConjugationPresent.ilselles
    FROM Verb, ConjugationPresent
    WHERE ConjugationPresent.verb_id = Verb.id`,
    (err, rows) => {
    if (err) {
      db.close();
      console.log(err);
    } else {
      const formatRes = rows.map(({ id, name, translation, ...conjugation }) => ({
        id: id,
        name: name,
        translation: translation,
        conjugation: {
          je: conjugation.je,
          tu: conjugation.tu,
          ilelle: conjugation.ilelle,
          nous: conjugation.nous,
          vous: conjugation.vous,
          ilselles: conjugation.ilselles,
        }
      }))
      return res.send(formatRes);
    }
  })
  db.close();
});

verbs.post('/presentanswers', (req, res) => {
  const db = new sqlite3.Database('database.sqlite');
  const score = req.body.score;
  const createdAt = req.body.createdAt;
  const solvedIn = req.body.solvedIn;
  const verbId = req.body.verbId;
  const userId = req.body.userId;

  db.run(
    `INSERT INTO ConjugationPresentScore (score, created_at, solved_in, user_id, verb_id)
    VALUES (?, ?, ?, ?, ?)`,
    score, createdAt, solvedIn, userId, verbId, (err) => {
    if (err) {
      console.log(err);
      db.close();
    } else {
      db.close();
      return res.status(200).send('Saved');
    }
  })
})

verbs.get('/profile/:id', (req, res) => {
  const id = req.params.id;

  const db = new sqlite3.Database('database.sqlite');

  db.all(
    `SELECT v.name, COUNT(verb_id) AS practice_time
    FROM Verb v JOIN ConjugationPresentScore cps ON v.id = cps.verb_id
    WHERE cps.user_id=?
    GROUP BY v.name
    ORDER BY practice_time DESC
    LIMIT 5`,
    id, (err, row) => {
    if (err) {
      console.log(err);
      db.close();
      return;
    } else {
      db.close();
      return res.status(200).send(row);
    }
  })
})

module.exports = verbs;
