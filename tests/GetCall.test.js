const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');

test('GET /api/hello returns expected message', async ({ request }) => {
  const response = await request.get('http://localhost:8080/api/hello');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toEqual({ message: 'Hello from WireMock!' });
});