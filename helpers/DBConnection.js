const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_sales_nodejs'
});

conn.connect((err) => {
    console.log('Mysql Terkoneksi');
});

module.exports = conn;