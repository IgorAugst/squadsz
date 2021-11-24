const express = require('express');

const routes = express.Router();
const { CompanyController, EmployeeController, RegisterController } = require('./controllers');

routes.get('/', CompanyController.login);
routes.get('/empresa', CompanyController.dashboard);
routes.get('/empresa/entrar', CompanyController.login);
routes.get('/empresa/registrar', CompanyController.register);
routes.get('/empresa/squads', CompanyController.squads);
routes.get('/empresa/squads/registrar', CompanyController.renderSquadsRegister);
routes.get('/empresa/squads/:id', CompanyController.renderSquadsEdit);
routes.get('/empresa/funcionarios', CompanyController.renderEmployees);
routes.get('/empresa/funcionarios/registrar', CompanyController.renderEmployeesRegister);
routes.get('/empresa/funcionarios/:id', CompanyController.renderEmployeesEdit);
routes.get('/empresa/projetos', CompanyController.renderProjects);
routes.get('/empresa/projetos/registrar', CompanyController.renderProjectsRegister);
routes.get('/empresa/projetos/:id', CompanyController.renderProjectsEdit);

routes.get('/funcionario/entrar', EmployeeController.renderLogin);

routes.get('/teste', RegisterController.teste);
routes.post('/registrar/empresa', RegisterController.registerCompany)

module.exports = routes;
