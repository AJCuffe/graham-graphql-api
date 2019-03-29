/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import loaders from './loaders';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());

// eslint-disable-next-line consistent-return
const getMe = async req => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session has expired. Please sign in again.',
      );
    }
  }
};

// TODO: implement Redis for caching at some point

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
        },
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

// Expose subscriptions with an advanced HTTP server setup
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// const createUsersWithMessages = async date => {
//   await models.User.create({
//     username: 'AJCuffe',
//     email: 'adamcuffe27@icloud.com',
//     password: 'adamcuffe',
//     role: 'ADMIN',
//   });

//   await models.User.create({
//     username: 'ddavids',
//     email: 'ddavids@gmail.com',
//     password: 'ddavids',
//   });
// };

// const isTest = !!process.env.TEST_DATABASE;
// const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;

sequelize.sync().then(async () => {
  // if (isTest || isProduction) {
  //   createUsersWithMessages(new Date());
  // }

  httpServer.listen({ port }, () => {
    console.log(`Apollo server started on http://localhost:${port}/graphql`);
  });
});
