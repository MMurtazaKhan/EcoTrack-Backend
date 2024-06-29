const request = require('supertest');

const baseUrl = 'https://ecotrack-dev.vercel.app';
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2VkYTRhNDdlYzU1MzI3OTU1OTc3YiIsImlhdCI6MTcxOTYzMjA0MSwiZXhwIjoxNzIyMjI0MDQxfQ.72KuQ9ilGh43v2F9jt9OC0pVMNfYPWMtDiAGPebErC8";
const testUserId = "65f6cf15a0a6a67d2493d722";
const testPostId = "667f80b23ed75a6d4f46f80c";

describe('Post API tests', () => {
  it('should add a new post', async () => {
    const newPost = {
      userId: testUserId,
      image: 'http://example.com/image.jpg',
      postDescription: 'This is a test post.',
    };

    const response = await request(baseUrl)
      .post('/api/posts/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newPost);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should get all posts', async () => {
    const response = await request(baseUrl).get('/api/posts');

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  it('should get specific post by ID', async () => {
    const response = await request(baseUrl).get(`/api/posts/${testPostId}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should add a comment to a post', async () => {
    const comment = {
      userId: testUserId,
      comment: 'This is a test comment.',
    };

    const response = await request(baseUrl)
      .put(`/api/posts/${testPostId}/comments`)
      .send(comment);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should like a post', async () => {
    const like = { userId: testUserId };

    const response = await request(baseUrl)
      .put(`/api/posts/${testPostId}/like`)
      .send(like);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should delete a post', async () => {
    const response = await request(baseUrl)
      .delete(`/api/posts/${testPostId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('should get all advertisements of a user', async () => {
    const response = await request(baseUrl)
      .get('/api/posts/advertisement')
      .query({ userId: testUserId });

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  it('should get all posts of a specific user', async () => {
    const response = await request(baseUrl).get(`/api/posts/user/${testUserId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

});
