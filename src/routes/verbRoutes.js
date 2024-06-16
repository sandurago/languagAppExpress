const express = require('express');
const verbs = express.Router();
const sqlite3 = require('sqlite3').verbose();

verbs.get('/verbslist', (_req, res) => {
  const db = new sqlite3.Database('database.sqlite');

  db.all('SELECT Verb.name, Verb.translation, ConjugationPresent.je, ConjugationPresent.tu, ConjugationPresent.ilelle, ConjugationPresent.nous, ConjugationPresent.vous, ConjugationPresent.ilselles FROM Verb, ConjugationPresent WHERE ConjugationPresent.verb_id = Verb.id', (err, rows) => {
    if (err) {
      db.close();
      console.log(err);
    } else {
      const formatRes = rows.map(({ name, translation, ...conjugation }) => ({
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

module.exports = verbs;
