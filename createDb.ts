require('dotenv').config();
const mysql = require('mysql');
const _ = require('lodash');
const dbCred = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}

async function checkAndCreate() {
  let connection = mysql.createConnection(_.omit(dbCred, ['database']))
  connection.connect()
  let results  : any[] = await new Promise((resolve) => {
    connection.query('SHOW DATABASES', function (error, results) {
      if (error) throw error;
      resolve(results)
    });
  })

  let checkIfExists = results.filter(item => item.Database === dbCred.database).length || null
  if (!checkIfExists) {
    await new Promise((resolve) => {
      connection.query(`CREATE DATABASE ${dbCred.database} character set UTF8 collate utf8_unicode_ci`, function (error, results) {
        if (error) throw error;
        console.log(dbCred.database + ' database created')
        resolve(true)
      });
    })

  }
  connection.end()
}

if (process.env.ENVIRONMENT === 'develop') checkAndCreate();