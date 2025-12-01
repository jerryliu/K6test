import http from 'k6/http';
import { sleep, check } from 'k6';
import { API_KEY } from '../modules/unitModule.js';
import { creatorId } from '../modules/authModule.js';
import { itemId } from '../modules/mediaModule.js';

export const options = {
  // stages: [
  //   { duration: '90s', target: 5 }, // simulate ramp-up of traffic
  //   { duration: '180s', target: 100 }, // stay at 100 users for 10 minutes
  //   { duration: '90s', target: 0 }, // ramp-down to 0 users
  // ],
};

const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

const headers = {
  'API-KEY': API_KEY(),
  'Content-Type': 'application/json',
};

export default function () {
  const postData = JSON.stringify({
    query: `query($itemId:String!, $memberId:String!){
      blastItemApk(
        itemId:$itemId,
        memberId:$memberId){
          message
          status
          body{
            description
            createdAt
          }
      }
    }`,
    variables: {
      itemId: itemId(),
      memberId: creatorId(),
    },
  });
  const res = http.post(`https://chat-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
