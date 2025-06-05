import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes.ts';

async function createApp() {
  const app = express();
  await registerRoutes(app);
  return app;
}

test('GET /api/plant-types responds without 404', async (t) => {
  const app = await createApp();
  const res = await request(app).get('/api/plant-types');
  assert.notStrictEqual(res.statusCode, 404);
});
