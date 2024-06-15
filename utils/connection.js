var mysql = require("mysql");
const { createContactsTable } = require("../models/contact");

var dbConn;

module.exports = {
  getDB: () => {
    return dbConn;
  },
  init: () => {
    dbConn = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      multipleStatements: true
    });
    dbConn.connect(function (err) {
      if (err) throw err;
      console.log("MYSQL Connected!");
      dbConn.query(createContactsTable, (err, results, fields) => {
        if (err) {
          console.error("Error creating table:", err.stack);
          return;
        }
        console.log("Contacts Table created successfully");
      });
    });
  },
  runQuery: (query, data) => {
    return new Promise((resolve, reject) => {
      dbConn.query(query, data, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },
};
