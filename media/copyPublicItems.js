import http from 'k6/http';
import { check } from 'k6';
import { creatorToken } from '../modules/authModule.js';

export default function () {
  // Define the request headers
  const headers = {
    'Content-Type': 'application/json',
    'access-token': creatorToken(),
  };

  // Define the request payload
  const payload = {
    // Add your payload data here, if any
  };

  // Make the POST request
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  // Make the POST request
  const response = http.post(
    `https://media-backend.${DOMAIN}/media/copyPublicItemsToPublicBucket`,
    JSON.stringify(payload),
    { headers },
  );

  // Check the response
  check(response, {
    'Status is 200': (r) => r.body.includes('true'),
  });
}
