const express = require('express');
const {
  CompanyController,
  EmployeeController,
} = require('./controllers');

const routes = express.Router();

routes.get('/', CompanyController.renderLogin);
routes.get('/empresa/entrar', CompanyController.renderLogin);
routes.get('/empresa/registrar', CompanyController.renderRegister);
routes.get('/funcionario/entrar', EmployeeController.renderLogin);

module.exports = routes;
