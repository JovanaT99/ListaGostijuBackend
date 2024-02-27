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

    const { location, startTime, endTime, type } = await Joi.object({
      location: Joi.string().required(),
    }).validateAsync(req.body);

    const event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        location,
        startTime,
        endTime,
        type,
      },
    });

    return res.status(201).json(event);
  } catch (err) {
    return next(err);
  }
};

export const addTablesToEvent = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const { tables } = await Joi.object({
      //eventId: Joi.number().required(),
      tables: Joi.array()
        .items(
          Joi.object({
            tableNumber: Joi.number().required(),
            numberOfSeats: Joi.number().required(),
            tableType: Joi.string().valid('ROUND', 'SQUARE').required(),
          })
        )
        .required(),
    }).validateAsync(req.body);

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      return res.status(404).json({ message: 'Događaj nije pronađen' });
    }
    // kreiraje više stolova u bazi podataka
    // kreiranje stolova istovremeno
    //prihvata niza i vraca jedan novi kad se sve resi u nizu
    const eventTables = await Promise.all(
      tables.map(
        async (table: {
          tableNumber: any;
          numberOfSeats: any;
          tableType: any;
        }) => {
          const existingTable = await prisma.eventTable.findFirst({
            where: {
              tableNumber: table.tableNumber,
              eventId: eventId,
            },
          });

          if (existingTable) {
            return existingTable;
          } else {
            return prisma.eventTable.create({
              data: {
                tableNumber: table.tableNumber,
                numberOfSeats: table.numberOfSeats,
                tableType: table.tableType,
                eventId: eventId,
              },
            });
          }
        }
      )
    );

    return res.status(201).json({ data: eventTables });
  } catch (err) {
    console.error('Error creating event table:', err);
    return next(err);
  }
};
