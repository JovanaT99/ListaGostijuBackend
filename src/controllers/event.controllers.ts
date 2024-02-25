import { Request, Response } from 'express';
import Joi from 'joi';

import prisma from '../utils/prisma';

export const createEvent = async (req: Request, res: Response, next: any) => {
  try {
    const { location, startTime, endTime, type, userId } = await Joi.object({
      location: Joi.string().required(),
      startTime: Joi.date().required(),
      endTime: Joi.date().required(),
      type: Joi.string().required(),
      userId: Joi.number().required(),
    }).validateAsync(req.body);

    const newEvent = await prisma.event.create({
      data: { location, startTime, endTime, type, userId },
    });

    return res.status(201).json(newEvent);
  } catch (err) {
    return next(err);
  }
};

export const updateEvent = async (req: Request, res: Response, next: any) => {
  try {
    const { id } = await Joi.object({
      id: Joi.string().required(),
    }).validateAsync(req.params);

    const { location } = await Joi.object({
      location: Joi.string().required(),
    }).validateAsync(req.body);

    const event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        location,
      },
    });

    return res.status(201).json(event);
  } catch (err) {
    return next(err);
  }
};
