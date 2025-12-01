import http from 'k6/http';
import { sleep, check } from 'k6';
import { creatorId, creatorToken } from '../modules/authModule.js';

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
    query: `query getCustomCreatorToken($memberId:String!){
      getCustomCreatorToken(creatorId:$memberId){
        status
        message
        body{
          token
        }
      }
    }`,
    variables: {
      memberId: creatorId(),
    },
  });
  const res = http.post(`https://auth-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
