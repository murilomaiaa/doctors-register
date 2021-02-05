import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';
import routes from './routes';

import '../typeorm';
import '@shared/container';
import { isCelebrateError } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use((error: Error, _: Request, response: Response, __: NextFunction) => {
  if (error instanceof AppError) {
    if (error.statusCode === 500 || error.type === 'internal') {
      return response.status(500).json({
        status: 'error',
        type: 'Internal',
        message: 'Internal server error',
      });
    }
    const { statusCode } = error;

    return response.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  if (isCelebrateError(error)) {
    const values = error.details.values();
    let { message } = values.next().value.details[0];
    message = message.replace(`"`, ``).replace(`"`, ``);


    return response.status(400).json({
      status: 'error',
      type: 'validation',
      message,
    });
  }

  console.log(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
