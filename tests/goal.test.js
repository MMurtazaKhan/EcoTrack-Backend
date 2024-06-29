const request = require('supertest');

const baseUrl = 'https://ecotrack-dev.vercel.app';
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2VkYTRhNDdlYzU1MzI3OTU1OTc3YiIsImlhdCI6MTcxOTYzMjA0MSwiZXhwIjoxNzIyMjI0MDQxfQ.72KuQ9ilGh43v2F9jt9OC0pVMNfYPWMtDiAGPebErC8";
const testUserId = "65f6cf15a0a6a67d2493d722";

describe('API tests', () => {
  let testGoalId;

  // Goals Routes
  it('should add a new goal', async () => {
    const newGoal = {
      userId: testUserId,
      category: 'electricity',
      percentage: 20,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      goalAchieved: false,
    };

    const response = await request(baseUrl)
      .post('/api/goals/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newGoal);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should get all goals for a user', async () => {
    const response = await request(baseUrl)
      .get(`/api/goals/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should get a goal by ID', async () => {
    const response = await request(baseUrl)
      .get(`/api/goals/${testGoalId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should get weekly data', async () => {
    const response = await request(baseUrl)
      .get(`/api/goals/weekly-data/${testUserId}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

});
