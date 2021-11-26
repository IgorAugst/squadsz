const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./db/connection');

function initialize(passport) {
  function authenticateUser(email, password, done) {
    try {
      pool.query('SELECT * FROM company WHERE email = $1', [email], (err, results) => {
        if (err) {
          throw err;
        }
        if (results.rows.length === 0) {
          return done(null, false, { message: 'E-mail não cadastrado' });
        }

        const user = results.rows[0];
        bcrypt.compare(password, user.password.trim()).then((isMatchPassword) => {
          if (isMatchPassword) {
            return done(null, user);
          }
          return done(null, false, { message: 'Senha incorreta' });
        });
      });
    } catch (error) {
      done(error, false);
    }
  }

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    authenticateUser,
  ));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    try {
      pool.query('SELECT * FROM company WHERE id = $1', [id], (err, results) => {
        if (err) {
          console.log(err.message);
          throw err;
        }
        done(err, results.rows[0]);
      });
    } catch (error) {
      done(error, null);
    }
  });
}

module.exports = initialize;
