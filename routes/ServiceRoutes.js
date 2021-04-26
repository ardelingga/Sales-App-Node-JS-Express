'use strict'
const ServiceControllers = require('../controllers/ServiceControllers');
const VerifyToken = require('../helpers/VerifyToken');

var APIURL = '/api/v1/'

exports.routesConfig = function(app){
    app.post(APIURL+'login', ServiceControllers.Login);
    app.route('/register').post(ServiceControllers.RegisterCustomer);

    app.get(APIURL+'list_customers2', ServiceControllers.GetCustomers);
    app.get(APIURL+'list_customers', VerifyToken, ServiceControllers.GetCustomers);
    app.get(APIURL+'kategori_item', VerifyToken, ServiceControllers.GetKategori);
    app.post(APIURL+'add_kategori', VerifyToken, ServiceControllers.AddKategori);
    app.post(APIURL+'edit_kategori', VerifyToken, ServiceControllers.EditKategori);
    app.post(APIURL+'delete_kategori', VerifyToken, ServiceControllers.DeleteKategori);
    app.get(APIURL+'list_item', VerifyToken, ServiceControllers.ListItemsBarang);
    app.post(APIURL+'add_item', VerifyToken, ServiceControllers.AddBarang);
    app.post(APIURL+'edit_item', VerifyToken, ServiceControllers.EditBarang);
    app.post(APIURL+'delete_item', VerifyToken, ServiceControllers.DeleteBarang);
    app.get(APIURL+'list_cart', VerifyToken, ServiceControllers.GetListCart);
    app.post(APIURL+'add_cart', VerifyToken, ServiceControllers.AddCart);
    app.post(APIURL+'edit_cart', VerifyToken, ServiceControllers.EditCart);
    app.post(APIURL+'delete_cart', VerifyToken, ServiceControllers.DeleteCart);
}