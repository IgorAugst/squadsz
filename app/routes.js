const express = require('express');
const passport = require('passport');

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
routes.get('/empresa/registrar', CompanyController.register);

routes.get('/empresa/squads', SquadController.index);
routes.post('/empresa/squads/registrar', SquadController.register);
routes.get('/empresa/squads/registrar', SquadController.registerView);
routes.get('/empresa/squads/:id', SquadController.updateView);
routes.post('/empresa/squads/:id', SquadController.update);

routes.get('/empresa/funcionarios', EmployeeController.index);
routes.get('/empresa/funcionarios/registrar', EmployeeController.registerView);
routes.post('/empresa/funcionarios/registrar', EmployeeController.register);
routes.get('/empresa/funcionarios/:id', EmployeeController.updateView);
routes.post('/empresa/funcionarios/:id', EmployeeController.update);

routes.get('/empresa/projetos', ProjectController.index);
routes.get('/empresa/projetos/registrar', ProjectController.registerView);
routes.post('/empresa/projetos/registrar', ProjectController.register);
routes.get('/empresa/projetos/:id', ProjectController.updateView);
routes.post('/empresa/projetos/:id', ProjectController.update);

routes.get('/funcionario/entrar', EmployeeController.renderLogin);

routes.post('/empresa/registrar', AuthController.registerCompany);

routes.post('/empresa/entrar', passport.authenticate('local', {
  successRedirect: '/empresa',
  failureRedirect: '/',
  failureFlash: true,
}));

module.exports = routes;
