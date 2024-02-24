import { Request, Response } from 'express';
import Joi from 'joi';

import prisma from '../utils/prisma';

const eventSchema = Joi.object({
  location: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  type: Joi.string().required(),
  userId: Joi.number().required(),
});

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newEvent = await prisma.event.create({
      data: value,
    });

    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
