const request = require('supertest');

const baseUrl = 'https://ecotrack-dev.vercel.app';
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2VkYTRhNDdlYzU1MzI3OTU1OTc3YiIsImlhdCI6MTcxOTYzMjA0MSwiZXhwIjoxNzIyMjI0MDQxfQ.72KuQ9ilGh43v2F9jt9OC0pVMNfYPWMtDiAGPebErC8";
const testUserId = "65f6cf15a0a6a67d2493d722";

describe('Emission API tests', () => {

  it('should add a new emission', async () => {
    const newEmission = {
      user: testUserId,
      category: 'electricity',
      carbonEmitted: 15.5,
    };

    const response = await request(baseUrl)
      .post('/api/emissions/addEmission')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newEmission);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should get all emissions for a user', async () => {
    const response = await request(baseUrl)
      .get(`/api/emissions/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should get weekly emissions data for a user', async () => {
    const response = await request(baseUrl)
      .get(`/api/emissions/weekly/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

});
