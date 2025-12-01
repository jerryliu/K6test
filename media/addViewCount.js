import http from 'k6/http';
import { sleep, check } from 'k6';
import { itemId } from '../modules/mediaModule.js';
import { creatorToken } from '../modules/authModule.js';

export const options = {
  // stages: [
  //   { duration: '90s', target: 5 }, // simulate ramp-up of traffic
  //   { duration: '180s', target: 100 }, // stay at 100 users for 10 minutes
  //   { duration: '90s', target: 0 }, // ramp-down to 0 users
  // ],
};

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };
  const postData = JSON.stringify({
    query: `mutation($itemId:String!){
      addViewCount(itemId:$itemId){
        status
        message
       }
    }
    `,
    variables: {
      // itemId: 'b04974d9-b75b-4e46-8b33-2d0414b40fab',
      itemId: itemId(),
    },
  });

  const res = http.post(`https://media-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'addViewCount SUCCESS': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
