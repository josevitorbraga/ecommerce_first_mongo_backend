import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const generateToken = user => {
  return jwt.sign(
    {
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    `${process.env.JWT_SECRET}`,
    { expiresIn: '30d' },
  );
};

export const isAuth = (
  request: any,
  response: Response,
  next: NextFunction,
) => {
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    return jwt.verify(
      token,
      `${process.env.JWT_SECRET}` || 'somethingsecret',
      (err, decode) => {
        if (err) {
          return response.status(401).send({ message: 'invalid token' });
        }
        request.user = decode;
        return next();
      },
    );
  }
  return response.status(401).send({ message: 'missing token' });
};

export const isAdmin = (request, response, next) => {
  if (request.user && request.user.isAdmin) {
    return next();
  }
  return response.status(401).send({ message: 'Invalid admin token' });
};
