import { Request, Response } from 'express';
import Joi from 'joi';
import prisma from '../utils/prisma';

export const addGuestsToEvent = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const { guests } = await Joi.object({
      guests: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            isAttending: Joi.boolean().required(),
            eventTableId: Joi.number().optional(),
            seatNumber: Joi.number().optional(),
          })
        )
        .required(),
    }).validateAsync(req.body);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { eventTables: { include: { eventTableGuests: true } } },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const updatedGuests = await Promise.all(
      guests.map(async (guest: { eventTableId: number; seatNumber: number; name: any; isAttending: any; }) => {
        if (guest.eventTableId) {
          const table = event.eventTables.find(
            (table) => table.id === guest.eventTableId
          );
          if (!table) {
            throw new Error(
              `Table with id ${guest.eventTableId} not found in event`
            );
          }
          if (table.numberOfSeats <= table.eventTableGuests.length) {
            throw new Error(`Table with id ${guest.eventTableId} is full`);
          }
          if (
            table.eventTableGuests.some(
              (g) => g.seatNumber === guest.seatNumber
            )
          ) {
            throw new Error(
              `Seat number ${guest.seatNumber} is already taken at table ${guest.eventTableId}`
            );
          }
        }

        return prisma.eventGuest.create({
          data: {
            name: guest.name,
            isAttending: guest.isAttending,
            eventId: eventId,
            eventTableGuest: guest.eventTableId
              ? {
                  create: {
                    eventTableId: guest.eventTableId,
                    seatNumber: guest.seatNumber,
                  },
                }
              : undefined,
          },
        });
      })
    );

    return res.status(201).json({ data: updatedGuests });
  } catch (err) {
    console.error('Error adding guests to event:', err);
    return next(err);
  }
};
