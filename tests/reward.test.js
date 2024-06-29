const request = require('supertest');

const baseUrl = 'https://ecotrack-dev.vercel.app';
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2VkYTRhNDdlYzU1MzI3OTU1OTc3YiIsImlhdCI6MTcxOTYzMjA0MSwiZXhwIjoxNzIyMjI0MDQxfQ.72KuQ9ilGh43v2F9jt9OC0pVMNfYPWMtDiAGPebErC8";
const testUserId = "65f6cf15a0a6a67d2493d722";

describe('API tests', () => {
  // Rewards Routes
  it('should get all rewards', async () => {
    const response = await request(baseUrl).get('/api/rewards');

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  it('should get user reward history', async () => {
    const response = await request(baseUrl).get(`/api/rewards/${testUserId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  // Vouchers Routes
  it('should get all vouchers for users', async () => {
    const response = await request(baseUrl)
      .get('/api/vouchers/allVouchersForUsers')
      .query({ userId: testUserId });

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should get all vouchers of a user', async () => {
    const response = await request(baseUrl)
      .get('/api/vouchers/allVouchersOfUser')
      .query({ userId: testUserId });

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

});
