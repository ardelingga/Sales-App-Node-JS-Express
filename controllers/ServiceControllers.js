const ServiceModels = require('../models/ServiceModels');
const JsonResponse = require('../helpers/JsonResponse');
const { Failed } = require('../helpers/JsonResponse');
const md5 = require('md5');
const conn = require('../helpers/DBConnection');
const JwtKeys = require('../key/JwtKeys');
const jwt = require('jsonwebtoken');



const ServiceControllers = module.exports = {
    Login: async function(req, res){
        try{
            var uss = req.body.username.toLowerCase();
            var pass = md5(req.body.password);

            var checkUss = await ServiceModels.CheckUsername(uss);
            if(checkUss){
                JsonResponse.Failed("Username anda tidak ditemukan!", res);
            }else{
                var resultLogin = await ServiceModels.CheckLogin(uss, pass);
                if(resultLogin.length != 0){
                    var privateKey = await JwtKeys.PrivateKey(); 
                    var signOptions = await JwtKeys.SignOptions(); 

                    
                    var token = jwt.sign({resultLogin}, privateKey, signOptions);
                    
                    var data = resultLogin[0];
                    data['token'] = token;
                    delete data.id;
                    JsonResponse.SuccessWithData(data, "Login Berhasil!", res);
                }else{
                    JsonResponse.Failed("Password anda salah!", res);
                }
            }
            
        }catch(e){
            console.log('ERROR => '+e);
            JsonResponse.Failed('Terjadi Kesalahan! '+e, res);
        }
    },
    RegisterCustomer: async function(req, res){

        var checkUss = await ServiceModels.CheckUsername(req.body.username.toLowerCase());
        var checkEmail = await ServiceModels.CheckEmail(req.body.email.toLowerCase());
        var checkPhone = await ServiceModels.CheckNoPhone(req.body.no_telp);

        if(!checkUss){
            JsonResponse.Failed("Username sudah terdaftar", res);
        }else{
            if(!checkEmail){
                JsonResponse.Failed("Email sudah terdaftar", res);
            }else{
                if(!checkPhone){
                    JsonResponse.Failed("No hp sudah terdaftar", res);
                }else{
                    var regist = await ServiceModels.RegisterCustomer(req);

                    if(regist.code === 200){
                        JsonResponse.Success("Berhasil Register!", res);
                    }else{
                        JsonResponse.Failed("Gagal Register!", res);
                    }
                }
            }
        }
    },
    GetCustomers: async function(req, res){
        try{
            var customers = await ServiceModels.GetCustomers();
            JsonResponse.SuccessWithData(customers, 'Berhasil get data customers!', res);
        }catch(e){
            console.log(e)
        }
    },
    GetKategori: async function(req, res){
        try{
            var kategori = await ServiceModels.AllKategori();
            JsonResponse.SuccessWithData(kategori, 'Berhasil get kategori!', res);
        }catch(e){
            console.log(e)
        }
    },
    AddKategori: async function(req, res){
        try{
            if(!req.body.nama_kategori){
                JsonResponse.Failed('Nama kategori tidak ada!', res);
            }else{
                await ServiceModels.AddKategori(req);
                JsonResponse.Success('Berhasil add kategori!', res);
            }
        }catch(e){
            console.log(e);
        }
    },
    EditKategori: async function(req, res){
        try{
            if(!req.body.id){
                JsonResponse.Failed('Id kategori tidak ada!', res);
            }else if(!req.body.nama_kategori){
                JsonResponse.Failed('Nama kategori tidak ada!', res);
            }else{
                await ServiceModels.EditKategori(req);
                JsonResponse.Success('Berhasil edit kategori!', res);
            }
        }catch(e){
            console.log(e)
        }
    },
    DeleteKategori: async function(req, res){
        try{
            if(!req.body.id){
                JsonResponse.Failed('Id kategori tidak ada!', res);
            }else{
                await ServiceModels.DeleteKategori(req);
                JsonResponse.Success('Berhasil hapus kategori!', res);
            }
        }catch(e){
            console.log(e);
        }
    },
    ListItemsBarang: async function(req, res){
        
        try{
            var itemsBarang = await ServiceModels.GetItemsBarang(req);
            JsonResponse.SuccessWithData(itemsBarang, 'Berhasil get data items!', res);
        }catch(e){
            console.log(e);
        }
    },
    AddBarang: async function(req, res){
        try{
            if(!req.body.nama){
                JsonResponse.Failed('Nama barang tidak ada!', res);
            }else{
                await ServiceModels.AddBarang(req);
                JsonResponse.Success('Berhasil add barang!', res);
            }
        }catch(e){
            console.log(e);
        }
    },
    EditBarang: async function(req, res){
        try{
            if(!req.body.id || !req.body.nama || !req.body.kategori_id || !req.body.harga || !req.body.stok || !req.body.deskripsi || !req.body.img || !req.body.supplier_id){
                JsonResponse.Failed('Gagal Edit Item! Pastikan data di isi dengan benar.', res);
            }else{
                await ServiceModels.EditBarang(req);
                JsonResponse.Success('Berhasil edit barang!', res);
            }
        }catch(e){
            console.log(e)
        }
    },
    DeleteBarang: async function(req, res){
        try{
            if(!req.body.id){
                JsonResponse.Failed('Id item tidak ada!', res);
            }else{
                await ServiceModels.DeleteBarang(req);
                JsonResponse.Success('Berhasil hapus item barang!', res);
            }
        }catch(e){
            console.log(e);
        }
    },
    GetListCart: async function(req, res){
        try{
            var itemsBarang = await ServiceModels.ListCart(req);
            if(itemsBarang.length == 0){
                JsonResponse.Success('Belum ada produk dikeranjang!', res);
            }else{
                JsonResponse.SuccessWithData(itemsBarang, 'Berhasil get data cart!', res);
            }
        }catch(e){
            console.log(e);
        }
    },
    AddCart: async function(req, res){
        try{
            if(!req.body.customer_id || !req.body.barang_id || !req.body.qty){
                JsonResponse.Failed('Pastikan data di isi dengan benar!', res);
            }else{
                await ServiceModels.AddCart(req);
                JsonResponse.Success('Berhasil add barang!', res);
            }
        }catch(e){
            console.log(e);
        }
    },
    EditCart: async function(req, res){
        try{
            if(!req.body.id || !req.body.qty ){
                JsonResponse.Failed('Gagal Edit Cart! Pastikan data di isi dengan benar.', res);
            }else{
                await ServiceModels.EditCart(req);
                JsonResponse.Success('Berhasil edit cart!', res);
            }
        }catch(e){
            console.log(e)
        }
    },
    DeleteCart: async function(req, res){
        try{
            if(!req.body.id){
                JsonResponse.Failed('Id item tidak ada!', res);
            }else{
                await ServiceModels.DeleteCart(req);
                JsonResponse.Success('Berhasil hapus item cart!', res);
            }
        }catch(e){
            console.log(e);
        }
    },
}