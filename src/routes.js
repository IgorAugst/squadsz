import { Router } from 'express';
import { AuthenticationController } from './controllers/index.js';

const routes = Router();

const authenticationController = new AuthenticationController();

routes.get('/', authenticationController.index);

export default routes;