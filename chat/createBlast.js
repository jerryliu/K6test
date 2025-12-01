import http from 'k6/http';
import { sleep, check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { creatorToken } from '../modules/authModule.js';
export const options = {
  stages: [
    // { duration: '90s', target: 20 }, // simulate ramp-up of traffic
    // { duration: '180s', target: 60 }, // simulate ramp-up of traffic
  ],
};

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };

  const postData = JSON.stringify({
    query: `mutation createBlast($groupId: ID!, $itemIds: [String!], $sendAt:DateTime!) {
      createBlast(input: { itemIds: $itemIds, groupId: $groupId, messageContent:"${uuidv4()}", sendAt:$sendAt }) {
        message
        status
        body {
          id
        }
      }
    }
    `,
    variables: {
      groupId: 'Free',
      itemIds: [],
      sendAt: '2023-04-21T01:37:56.825Z',
    },
  });

  const res = http.post(`https://chat-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'createBlast SUCCESS': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
