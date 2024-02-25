import { Request, Response } from 'express';
import Joi from 'joi';

import prisma from '../utils/prisma';
import { HttpNotFound, HttpValidationError } from '../utils/errors.util';
import { validationResult } from 'express-validator';

import bcrypt from 'bcrypt';

export async function getUser(req: Request, res: Response, next: any) {
  try {
    const { id } = await Joi.object({
      id: Joi.number().required(),
    }).validateAsync(req.params ?? {});

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpNotFound('User not found');
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    return next(error);
  }
}

export async function searchUsers(req: Request, res: Response, next: any) {
  try {
    const { email } = await Joi.object({
      email: Joi.string().required(),
    }).validateAsync(req.query ?? {});

    const results = await prisma.user.findMany({
      where: {
        email: {
          contains: email,
        },
      },
    });
    return res.status(200).json({ data: results });
  } catch (error) {
    return next(error);
  }
}

export const createUser = async (req: Request, res: Response, next: any) => {
  try {
    const { name, email, password }  = await Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required()
    }).validateAsync(req.body);


    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new HttpValidationError('Already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ data: user });
  } catch (error) {
    return next(error)
  }
};

export const getAllUsers = async (req: Request, res: Response, next: any) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({data: users});
  } catch (error) {
    return next(error)
  }
};
