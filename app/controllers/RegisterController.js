const pool = require('../db/connection')
const bcrypt = require('bcrypt')

const saltRounds = 10;

class RegisterController{
    static async teste(req, res){
        const rows = await pool.query('SELECT NOW()');

        return res.send(rows.rows[0]);
    }

    static async registerCompany(req, res){
        const insertString = 'INSERT INTO company (cnpj, name, email, password) VALUES ($1, $2, $3, $4)'
        const query = req.query;

        bcrypt.hash(req.query['password'], saltRounds, (err, hash) => {
            const values = [query.cnpj, query.name, query.email, hash];


            pool.query(insertString, values, (err, resp) =>{
                if(err){
                    res.status(418).send("erro");
                }else{
                    res.status(200).send("ok");
                }
            })

            return res
        })
    }
}

module.exports = RegisterController