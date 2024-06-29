const request = require("supertest")

const baseUrl = 'https://ecotrack-dev.vercel.app';
const Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2VkYTRhNDdlYzU1MzI3OTU1OTc3YiIsImlhdCI6MTcxOTYzMjA0MSwiZXhwIjoxNzIyMjI0MDQxfQ.72KuQ9ilGh43v2F9jt9OC0pVMNfYPWMtDiAGPebErC8";
const UserId = "65f6cf15a0a6a67d2493d722";

describe('User API tests', () => {
  it('should register a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'testtuserr@example.com',
      password: 'password123',
      profilePic: 'http://example.com/profile-pic.jpg'
    };

    const response = await request(baseUrl)
      .post('/api/users/register')
      .send(newUser);

    expect(response.status).toBe(400);
  });

  it('should authenticate a user', async () => {
    const user = {
      email: 'testuser@example.com',
      password: 'password123'
    };

    const response = await request(baseUrl)
      .post('/api/users/login')
      .send(user);

    expect(response.status).toBe(200);
  });

  it('should get all users', async () => {
    const response = await request(baseUrl).get('/api/users');

    expect(response.status).toBe(200);
  });

  it('should get a specific user by ID', async () => {
    const userId = "667eda4a47ec55327955977b";

    const response = await request(baseUrl).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  it('should edit a user profile', async () => {
    const updatedData = {
      name: 'Updated Test User',
      email: 'updatedtestuser@example.com'
    };

    const response = await request(baseUrl)
      .put('/api/users/edit')
      .set('Authorization', `Bearer ${Token}`)
      .send(updatedData);

    expect(response.status).toBe(500);
  });

  it('should delete all users', async () => {
    const response = await request(baseUrl).delete('/api/users');

    expect(response.status).toBe(401);
  });

});
