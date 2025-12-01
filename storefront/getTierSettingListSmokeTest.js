import http from 'k6/http';
import { sleep, check } from 'k6';
import { userName } from '../modules/hotlineModule.js';
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

  const getTierSettingListApi = JSON.stringify({
    query: `query getTierSettingList($userName:String!){
      getTierSettingList(data: { userName: $userName }) {
        status
        message
        body {
          id
          memberId
        }
      }
    }
    `,
    variables: { userName: userName() },
  });

  const tierListRes = http.post(`https://storefront-backend.${DOMAIN}/graphql`, getTierSettingListApi, {
    headers: headers,
  });
  check(tierListRes, { 'get private profile success': (r) => r.body.includes('memberId') });
  check(tierListRes, { 'get get tier setting list': (r) => r.body.includes('id') });
  sleep(1);
}
