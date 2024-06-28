// const request = require('supertest');
// const app = require('../server');

// // Example test cases
// describe('GET /api/users', () => {
//   it('should respond with 200 status and JSON array', async () => {
//     const response = await request(app).get('/api/users');
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Array);
//   });
// });

// describe('POST /api/users', () => {
//   it('should create a new user with valid data', async () => {
//     const newUser = { username: 'testuser', email: 'test@example.com' };
//     const response = await request(app)
//       .post('/api/users')
//       .send(newUser);
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('id');
//     expect(response.body.username).toBe(newUser.username);
//   });

//   it('should return 400 on invalid data', async () => {
//     const invalidUser = { username: 'testuser' }; // Missing required 'email'
//     const response = await request(app)
//       .post('/api/users')
//       .send(invalidUser);
//     expect(response.status).toBe(400);
//   });
// });

// describe('GET /api/users/:id', () => {
//   it('should return a specific user by ID', async () => {
//     const response = await request(app).get('/api/users/1');
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id', 1);
//   });

//   it('should return 404 if user ID does not exist', async () => {
//     const response = await request(app).get('/api/users/999');
//     expect(response.status).toBe(404);
//   });
// });
