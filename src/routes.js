const express = require('express');

const routes = express.Router();
const { CompanyController, EmployeeController } = require('./controllers');

routes.get('/', CompanyController.renderLogin);
routes.get('/empresa', CompanyController.renderDashboard);
routes.get('/empresa/entrar', CompanyController.renderLogin);
routes.get('/empresa/registrar', CompanyController.renderRegister);
routes.get('/empresa/squads', CompanyController.renderSquads);
routes.get('/empresa/funcionarios', CompanyController.renderEmployees);
routes.get('/empresa/funcionarios/registrar', CompanyController.renderEmployeesRegister);
routes.get('/empresa/projetos', CompanyController.renderProjects);

routes.get('/funcionario/entrar', EmployeeController.renderLogin);

module.exports = routes;
