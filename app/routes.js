const express = require('express');

const routes = express.Router();

const {
  CompanyController,
  EmployeeController,
  AuthController,
  SquadController,
  ProjectController,
} = require('./controllers');

routes.get('/', CompanyController.login);
routes.get('/empresa', CompanyController.dashboard);
routes.get('/empresa/entrar', CompanyController.login);
routes.get('/empresa/registrar', CompanyController.create);

routes.get('/empresa/squads', SquadController.index);
routes.post('/empresa/squads/registrar', SquadController.create);
routes.get('/empresa/squads/registrar', SquadController.createView);
routes.get('/empresa/squads/:id', SquadController.updateView);
routes.post('/empresa/squads/:id', SquadController.update);

routes.get('/empresa/funcionarios', EmployeeController.index);
routes.get('/empresa/funcionarios/registrar', EmployeeController.createView);
routes.post('/empresa/funcionarios/registrar', EmployeeController.create);
routes.get('/empresa/funcionarios/:id', EmployeeController.updateView);
routes.post('/empresa/funcionarios/:id', EmployeeController.update);

routes.get('/empresa/projetos', ProjectController.index);
routes.get('/empresa/projetos/registrar', ProjectController.createView);
routes.post('/empresa/projetos/registrar', ProjectController.create);
routes.get('/empresa/projetos/:id', ProjectController.updateView);
routes.post('/empresa/projetos/:id', ProjectController.update);

routes.get('/funcionario/entrar', EmployeeController.renderLogin);

routes.post('/empresa/entrar', CompanyController.entrar);
module.exports = routes;