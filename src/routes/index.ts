import { Express } from 'express';

import * as UserController from '../controllers/user.controllers';
import { HttpNotFound } from '../utils/errors.util';

import  * as EventController from '../controllers/event.controllers';

const routes = (app: Express) => {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With, content-type, x-access-token, authorization'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.removeHeader('X-Powered-By');
    next();
  });

  app.get('/v1/health-check', (req, res) => {
    res.sendStatus(200);
  });
  app.get('/v1/users/search', UserController.searchUsers);
  app.get('/v1/users/:id', UserController.getUser);
  app.post('/user', UserController.createUser);
  app.get('/v1/allUsers', UserController.getAllUsers);
  app.post('/v1/events',EventController.createEvent);
  app.patch('/v1/events/:id',EventController.updateEvent);
  app.post('/v1/:eventId/addTables',EventController.addTablesToEvent);
  

  // catch all route => 404 Not Found
  app.use(function (req, res, next) {
    return next(new HttpNotFound());
  });
};
export default routes;
