const express = require('express');
const passport = require('passport');

const routes = express.Router();

const {
  CompanyController,
  EmployeeController,
  SquadController,
  ProjectController,
} = require('./controllers');

routes.get('/', CompanyController.login);
routes.get('/empresa', CompanyController.index);
routes.get('/empresa/entrar', CompanyController.login);
routes.get('/empresa/registrar', CompanyController.createView);
routes.post('/empresa/registrar', CompanyController.create);
routes.post('/empresa/editar', CompanyController.update);

routes.get('/empresa/squads', SquadController.index);
routes.post('/empresa/squads/registrar', SquadController.create);
routes.get('/empresa/squads/registrar', SquadController.createView);
routes.get('/empresa/squads/:id', SquadController.updateView);
routes.post('/empresa/squads/:id', SquadController.update);
routes.post('/empresa/squads/deletar/:id', SquadController.delete);

routes.get('/empresa/funcionarios', EmployeeController.index);
routes.get('/empresa/funcionarios/registrar', EmployeeController.createView);
routes.post('/empresa/funcionarios/registrar', EmployeeController.create);
routes.get('/empresa/funcionarios/:id', EmployeeController.updateView);
routes.post('/empresa/funcionarios/:id', EmployeeController.update);
routes.post('/empresa/funcionarios/deletar/:id', EmployeeController.delete);

routes.get('/empresa/projetos', ProjectController.index);
routes.get('/empresa/projetos/registrar', ProjectController.createView);
routes.post('/empresa/projetos/registrar', ProjectController.create);
routes.get('/empresa/projetos/:id', ProjectController.updateView);
routes.post('/empresa/projetos/:id', ProjectController.update);
routes.post('/empresa/projetos/deletar/:id', ProjectController.delete);

routes.get('/funcionario/entrar', EmployeeController.renderLogin);

routes.post('/empresa/entrar', passport.authenticate('local-company', {
  successRedirect: '/empresa',
  failureRedirect: '/empresa/entrar',
  failureFlash: true,
}));

routes.post('/funcionario/entrar', passport.authenticate('local-employee', {
  successRedirect: '/funcionario',
  failureRedirect: '/funcionario/entrar',
  failureFlash: true,
}));

routes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = routes;
