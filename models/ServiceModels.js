const conn = require('../helpers/DBConnection');
const mysql = require('mysql');
const md5 = require('md5');
const { query } = require('../helpers/DBConnection');

const ServiceModels = module.exports = {
    CheckLogin: async function(user, pass){
        return new Promise((resolve, reject) => {

            var query = ` SELECT`+
                        `   uss.id, uss.username, cust.nama, uss.email, uss.no_telp, cust.alamat`+
                        ` FROM`+
                        `   tbl_users AS uss `+
                        ` JOIN`+
                        `   tbl_customers AS cust ON uss.id = cust.id_user`+
                        ` WHERE`+
                        `   uss.username = ? AND uss.password = ?`;

            // var query = "SELECT uss.username, uss.email, uss.no_telp FROM ?? as uss WHERE ??=? AND ??=?";
            // var table = ["tbl_users", "username", user, "password", pass];
            // query = mysql.format(query, table);

            conn.query(query, [user, pass], function (error, rows, fields) {
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });
        });
        
    },
    CheckUsername: async function(username){
        return new Promise((resolve, reject) => {
            var query = "SELECT username FROM ?? WHERE ??=?";
            var table = ["tbl_users", "username", username];
            
            query = mysql.format(query, table);
            conn.query(query, function(error, rows, field){
                if(error){
                    reject(error);
                }else{
                    if(rows.length == 0){
                        resolve(1);
                    }else{
                        resolve(0);
                    }
                }
            });

        });
    },
    CheckEmail: async function(email){
        return new Promise((resolve, reject) => {
            var query = "SELECT email FROM ?? WHERE ??=?";
            var table = ["tbl_users", "email", email];
            
            query = mysql.format(query, table);
            conn.query(query, function(error, rows, field){
                if(error){
                    reject(error);
                }else{
                    if(rows.length == 0){
                        resolve(1);
                    }else{
                        resolve(0);
                    }
                }
            });

        });
    },
    CheckNoPhone: async function(no_telp){
        return new Promise((resolve, reject) => {
            var query = "SELECT no_telp FROM ?? WHERE ??=?";
            var table = ["tbl_users", "no_telp", no_telp];
            
            query = mysql.format(query, table);
            conn.query(query, function(error, rows, field){
                if(error){
                    reject(error);
                }else{
                    if(rows.length == 0){
                        resolve(1);
                    }else{
                        resolve(0);
                    }
                }
            });

        });
    },
    RegisterCustomer: async function(req){
        return new Promise((resolve, reject) => {
            var postUser = {
                username: req.body.username.toLowerCase(),
                password: md5(req.body.password),
                email: req.body.email,
                no_telp: req.body.no_telp,
                role_id: 3
            }

            var query = "INSERT INTO ?? SET ?";
            var table = ["tbl_users"];
            query = mysql.format(query, table);

            conn.query(query, postUser, function (error, rows, fields) {
                if(error){
                    reject(error);
                }else{
                    var id_user = rows.insertId;

                    var postCust = {
                        nama: req.body.nama,
                        jk: req.body.jk,
                        no_telp: req.body.no_telp,
                        email: req.body.email,
                        alamat: req.body.alamat,
                        id_user: id_user
                    }
                
                    var query = "INSERT INTO ?? SET ?";
                    var table = ["tbl_customers"];
                    query = mysql.format(query, table);

                    conn.query(query, postCust, function(error, rows, fields){
                        if(error){
                            reject(error);
                        }else{
                            resolve({'code':200, 'msg':'Berhasil Register'})
                        }

                    });
                }
            });
        });
        
    },
    GetCustomers: async function() {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM tbl_customers";
            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });
        });
    },
    GetItemsBarang: async function(req) {
        return new Promise((resolve, reject) => {

            var kategori_id = req.query.kategori_id;
            
            if(kategori_id == 0){
                var query = `SELECT * FROM tbl_barang`;
            }else{
                var query = `select ba.nama, kt.nama as kategori, ba.harga, ba.stok, ba.deskripsi, ba.img from tbl_barang as ba join tbl_kategori as kt on ba.kategori_id = kt.id where ba.kategori_id = ${kategori_id}`;
            }

            
            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });
        });
    },
    AddBarang: async function(req) {
        return new Promise((resolve, reject) => {
            
            var post = {
                nama: req.body.nama,
                kategori_id: req.body.kategori_id,
                harga: req.body.harga,
                stok: req.body.stok,
                deskripsi: req.body.deskripsi,
                img: req.body.img,
                supplier_id: req.body.supplier_id,
            }

            var query = `INSERT INTO ?? SET ?`;
            var table = ['tbl_barang'];
            query = mysql.format(query, table);

            conn.query(query, post, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });

        });
    },
    EditBarang: async function(req) {
        return new Promise((resolve, reject) => {
            
            var post = {
                id: req.body.id,
                nama: req.body.nama,
                kategori_id: req.body.kategori_id,
                harga: req.body.harga,
                stok: req.body.stok,
                deskripsi: req.body.deskripsi,
                img: req.body.img,
                supplier_id: req.body.supplier_id,
            }

            var query = `UPDATE tbl_barang SET nama=?, kategori_id=?, harga=?, stok=?, deskripsi=?, img=?, supplier_id=? WHERE id=?`;
            var table = [post.nama, post.kategori_id, post.harga, post.stok, post.deskripsi, post.img, post.supplier_id, post.id];
            query = mysql.format(query, table);

            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });

        });
    },
    DeleteBarang: async function(req) {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM ?? where ??=?`;
            var table = ['tbl_barang', 'id', req.body.id];
            query = mysql.format(query, table);
            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });
        });
    },
    AllKategori: async function() {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM tbl_kategori`;
            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });
        });
    },
    AddKategori: async function(req) {
        return new Promise((resolve, reject) => {
            
            var post = {
                nama: req.body.nama_kategori
            }

            var query = `INSERT INTO ?? SET ?`;
            var table = ['tbl_kategori'];
            query = mysql.format(query, table);

            conn.query(query, post, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });

        });
    },
    EditKategori: async function(req) {
        return new Promise((resolve, reject) => {
            
            var post = {
                id: req.body.id,
                nama: req.body.nama_kategori
            }

            var query = `UPDATE ?? SET ??=? WHERE ??=?`;
            var table = ['tbl_kategori', 'nama', post.nama, 'id', post.id];
            query = mysql.format(query, table);

            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });

        });
    },
    DeleteKategori: async function(req) {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM ?? where ??=?`;
            var table = ['tbl_kategori', 'id', req.body.id];
            query = mysql.format(query, table);
            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });
        });
    },
    ListCart: async function(req) {
        return new Promise((resolve, reject) => {

            var customer_id = req.query.customer_id;
            
            var query = `SELECT k.id, b.nama, kt.nama AS kategori, b.harga, b.img, k.qty, b.harga*k.qty AS total_harga FROM tbl_keranjang AS k
                JOIN tbl_barang AS b
                    on k.barang_id = b.id
                JOIN tbl_kategori AS kt
                    on b.kategori_id = kt.id
                JOIN tbl_customers AS c
                    on k.customer_id = c.id
                WHERE c.id=${customer_id}`;

            
            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });
        });
    },
    AddCart: async function(req) {
        return new Promise((resolve, reject) => {
            
            var post = {
                customer_id: req.body.customer_id,
                barang_id: req.body.barang_id,
                qty: req.body.qty
            }

            var query = `INSERT INTO ?? SET ?`;
            var table = ['tbl_keranjang'];
            query = mysql.format(query, table);

            conn.query(query, post, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });

        });
    },
    EditCart: async function(req) {
        return new Promise((resolve, reject) => {
            var post = {
                id: req.body.id,
                qty: req.body.qty
            }

            var query = `UPDATE ?? SET ??=? WHERE ??=?`;
            var table = ['tbl_keranjang', 'qty', post.qty, 'id', post.id];
            query = mysql.format(query, table);

            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });

        });
    },
    DeleteCart: async function(req) {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM ?? where ??=?`;
            var table = ['tbl_keranjang', 'id', req.body.id];
            query = mysql.format(query, table);
            conn.query(query, function(error, rows, fields){
                if(error){
                    reject(error);
                }else{
                    resolve(rows);
                }
            });
        });
    },
}