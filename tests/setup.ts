import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

import prisma from '../src/utils/prisma';

// jest.mock('ioredis', () => require('ioredis-mock'))

process.env.TEST = '1';

afterAll(async () => {
  await prisma.$disconnect();
});

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  //Flush redis

  // Delete for postgres
  await prisma.$queryRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  await prisma.$queryRaw`TRUNCATE TABLE "Event" RESTART IDENTITY CASCADE;`;
  await prisma.$queryRaw`TRUNCATE TABLE "EventTable" RESTART IDENTITY CASCADE;`;
  await prisma.$queryRaw`TRUNCATE TABLE "EventGuest" RESTART IDENTITY CASCADE;`;
  await prisma.$queryRaw`TRUNCATE TABLE "EventTableGuest" RESTART IDENTITY CASCADE;`;

  // Delete for sqlite
  // await prisma.user.deleteMany({})
  // await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE name='user';`

  await prisma.user.create({
    data: {
      email: 'jo@example.com',
      password: bcrypt.hashSync('password', 10),
      name: 'Test User',
    },
  });

  await prisma.event.create({
    data: {
      location: 'Beograd',
      startTime: '2023-07-20T14:00:00.000Z',
      endTime: '2023-07-20T20:00:00.000Z',
      type: 'Birthday',
      userId: 1,
    },
  });
});
