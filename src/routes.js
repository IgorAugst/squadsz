import { Router } from 'express';
import { AuthenticationController } from './controllers/index.js';

// Controllers
const authenticationController = new AuthenticationController();

// Routes
const routes = Router();
routes.get('/', authenticationController.index);

export default routes;