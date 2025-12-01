import http from 'k6/http';
import { sleep, check } from 'k6';
import { creatorToken } from '../modules/authModule.js';
export const options = {
  // stages: [
  //   { duration: '10s', target: 100 }, // below normal load
  //   { duration: '1m', target: 100 },
  //   { duration: '10s', target: 1400 }, // spike to 1400 users
  //   { duration: '200s', target: 1400 }, // stay at 1400 for 3 minutes
  //   { duration: '10s', target: 100 }, // scale down. Recovery stage.
  //   { duration: '3m', target: 100 },
  //   { duration: '10s', target: 0 },
  // ],
};

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

  const postData = JSON.stringify({
    query: `query {
    queryAgentRelation {
      status
      message
    }
  }
  `,
    variables: {},
  });

  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };

  const res = http.post(`https://storefront-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
