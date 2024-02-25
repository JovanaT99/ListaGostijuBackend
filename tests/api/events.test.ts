import request from 'supertest';
import apiSetup from '../../src/api.setup';

describe('events', () => {
  test('create ok', async () => {
    const data = {
      location: 'Beograd',
      startTime: '2023-07-20T14:00:00.000Z',
      endTime: '2023-07-20T20:00:00.000Z',
      type: 'Birthday',
      userId: 1,
    };

    const { body } = await request(apiSetup)
      .post('/v1/events')
      .send(data)
      .expect(201);

    expect(body.location).toBe(data.location);
    expect(body.startTime).toBe(data.startTime);
    expect(body.endTime).toBe(data.endTime);
    expect(body.type).toBe(data.type);
    expect(body.userId).toBe(data.userId);

    // //@ts-ignore
    // console.log('body', body);
  });

  test('create bad location', async () => {
    const data = {
      location: null,
      startTime: '2023-07-20T14:00:00.000Z',
      endTime: '2023-07-20T20:00:00.000Z',
      type: 'Birthday',
      userId: 1,
    };

    const { body } = await request(apiSetup)
      .post('/v1/events')
      .send(data)
      .expect(400);


    // //@ts-ignore
    // console.log('body', body);
  });



  test('update event location', async () => {


    const { body } = await request(apiSetup)
      .patch('/v1/events/1')
      .send({
        location: "Novi sad"
      })
      

    // //@ts-ignore
    console.log('body', body);
  });

});
