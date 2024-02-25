import request from 'supertest'

import apiSetup from '../../src/api.setup'

describe('users', () => {
    test('search by email single result', async () => {
        const { body } = await request(apiSetup)
            .get(`/v1/users/search?email=test`)
            .expect(200)

        expect(body.data.length).toBeGreaterThan(0)
        expect(body.data[0].email).toBe('test@email.com')
    })

    test('search by email no result', async () => {
        const { body } = await request(apiSetup)
            .get(`/v1/users/search?email=123`)
            .expect(200)

        expect(body.data.length).toBe(0)
    })

    test('get by id', async () => {
        const { body } = await request(apiSetup).get(`/v1/users/1`).expect(200)

        expect(body.data.email).toBe('test@email.com')
        expect(body.data.id).toBe(1)
    })

    test('get by id not found', async () => {
        const { body } = await request(apiSetup)
            .get(`/v1/users/10000`)
            .expect(404)
    })
})
