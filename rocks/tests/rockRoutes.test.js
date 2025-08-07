const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

describe('Rock API', () => {

  test('GET /api/rocks - should return array of rocks', async () => {
    const res = await request(app).get('/api/rocks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/rocks/list - should return list of rock summaries', async () => {
    const res = await request(app).get('/api/rocks/list');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
    }
  });

  test('GET /api/rocks/:id - valid id', async () => {
    // First get a real rock ID
    const rocks = await request(app).get('/api/rocks');
    if (rocks.body.length === 0) return;
    const id = rocks.body[0].id;

    const res = await request(app).get(`/api/rocks/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', id);
  });

  test('GET /api/rocks/:id - invalid id', async () => {
    const res = await request(app).get('/api/rocks/nonexistent-id');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('msg', 'Rock not found');
  });

  test('POST /api/rocks - should add a rock without image', async () => {
    const res = await request(app)
      .post('/api/rocks')
      .field('name', 'Test Rock')
      .field('type', 'Igneous')
      .field('color', 'Gray')
      .field('grain_size', 'Medium')
      .field('minerals', 'Quartz, Feldspar');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('msg', 'Rock added!');
    expect(res.body.rock).toHaveProperty('name', 'Test Rock');
  });

  test('POST /api/rocks - should add a rock with image', async () => {
    const imagePath = path.join(__dirname, 'sample.jpg');

    // Create dummy image if not exists
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, 'dummy content');
    }

    const res = await request(app)
      .post('/api/rocks')
      .field('name', 'Image Rock')
      .field('type', 'Sedimentary')
      .attach('image', imagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('msg', 'Rock added!');
    expect(res.body.rock).toHaveProperty('image');
  });
  test('GET /rock/search - should return filtered results', async () => {
    const res = await request(app).get('/rock/search?search_term=rock');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test('GET /rock/search - should return 400 if search_term is missing', async () => {
    const res = await request(app).get('/rock/search');
    expect(res.statusCode).toBe(400);
  });
  
});

