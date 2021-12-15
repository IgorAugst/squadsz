const express = require('express');

const routes = express.Router();

const {
  CompanyController,
  EmployeeController,
  SquadController,
  ProjectController,
  TaskController,
} = require('./controllers');
const SprintController = require('./controllers/SprintController');
const { CompanyMiddleware, AuthMiddleware } = require('./middlewares');

routes.post('/company/create', CompanyController.create);
routes.put('/company/update', CompanyController.update);
routes.get('/squads', AuthMiddleware.validate, SquadController.index);
routes.post(
  '/squads/create',
  CompanyMiddleware.validate,
  SquadController.create
);
routes.get('/squad/:id', AuthMiddleware.validate, SquadController.updateView);
routes.put(
  '/squad/update/:id',
  CompanyMiddleware.validate,
  SquadController.update
);
routes.delete(
  '/squad/delete/:id',
  CompanyMiddleware.validate,
  SquadController.delete
);
routes.get('/employees', AuthMiddleware.validate, EmployeeController.index);
routes.post(
  '/employees/create',
  CompanyMiddleware.validate,
  EmployeeController.create
);
routes.get(
  '/employee/:id',
  CompanyMiddleware.validate,
  EmployeeController.updateView
);
routes.put(
  '/employee/update/:id',
  AuthMiddleware.validate,
  EmployeeController.update
);
routes.delete('/employee/delete/:id', EmployeeController.delete);
routes.get('/employee', EmployeeController.index);
routes.post('/employee/login', EmployeeController.login);
routes.get('/projects', AuthMiddleware.validate, ProjectController.index);
routes.post(
  '/projects/create',
  CompanyMiddleware.validate,
  ProjectController.create
);
routes.get(
  '/project/:id',
  CompanyMiddleware.validate,
  ProjectController.updateView
);
routes.put(
  '/project/update/:id',
  CompanyMiddleware.validate,
  ProjectController.update
);
routes.delete('/project/delete/:id', ProjectController.delete);
routes.post('/company/login', CompanyController.login);
routes.get('/sprints', AuthMiddleware.validate, SprintController.index);
routes.post(
  '/sprints/create',
  CompanyMiddleware.validate,
  SprintController.create
);
routes.get('/sprint/:id', AuthMiddleware.validate, SprintController.get);
routes.delete(
  '/sprint/delete/:id',
  CompanyMiddleware.validate,
  SprintController.delete
);
routes.post('/task/create', AuthMiddleware.validate, TaskController.create);
routes.put('/task/update/:id', AuthMiddleware.validate, TaskController.update);
routes.delete(
  '/task/delete/:id',
  AuthMiddleware.validate,
  TaskController.delete
);

module.exports = routes;
