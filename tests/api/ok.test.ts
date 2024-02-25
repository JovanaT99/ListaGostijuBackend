import request from 'supertest'

import apiSetup from '../../src/api.setup'

describe('ok', () => {
    test('test ok', async () => {
        const {body} = await request(apiSetup)
            .get(`/v1/health-check`)
            .expect(200);
    })
})
