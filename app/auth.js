const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db/connection');
const { comparePassword } = require('./utils');

class Auth {
  constructor(table) {
    this.table = table;
  }

  async initialize(passport) {
    console.log(this.table);

    passport.use(`local-${this.table}`, new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',

      }, (email, password, done) => {
        try {
          console.log("entrando como: " + this.table);
          pool.query(`SELECT * FROM ${this.table} WHERE email = $1`, [email], async (err, results) => {
            if (err) {
              throw err;
            }
            if (results.rows.length === 0) {
              return done(null, false, { message: 'E-mail não cadastrado' });
            }

            const user = results.rows[0];
            const isMatchPassword = await comparePassword(password, user.password);

            if (isMatchPassword) {
              console.log(user);
              return done(null, user);
            }
            return done(null, false, { message: 'Senha incorreta' });
          });
        } catch (error) {
          done(error, false);
        }
      },
    ));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
      try {
        pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id], (err, results) => {
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
}

module.exports = Auth;
