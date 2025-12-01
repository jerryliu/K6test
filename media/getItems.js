import http from 'k6/http';
import { sleep, check } from 'k6';
import { creatorId, creatorToken } from '../modules/authModule.js';
import { userName } from '../modules/hotlineModule.js';
export const options = {
  // stages: [
  //   { duration: '10s', target: 100 }, // below normal load
  //   { duration: '1m', target: 100 },
  //   { duration: '10s', target: 1400 }, // spike to 1400 users
  //   { duration: '200s', target: 1400 }, // stay at 1400 for 3 minutes
  //   { duration: '10s', target: 100 }, // scale down. Recovery stage.
  //   { duration: '3m', target: 100 },
  //   { duration: '10s', target: 0 },
  // ] ,
  // thresholds: {
  //   // During the whole test execution, the error rate must be lower than 1%.
  //   http_req_failed: ['rate<0.01'],
  // },
  // vus: 10,
  // duration: '5s',
  // ext: {
  //   loadimpact: {
  //     // k6 cloud 上的 ID
  //     projectID: 3602823,
  //     // k6 cloud 上的專案名稱
  //     name: 'htln',
  //   },
  // },
};

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };
  const postData = JSON.stringify({
    query: `query getItems($memberId:String!, $userName:String!){
    getItems(data: { memberId: $memberId,
      filter: [ Follower, Private, Public, Subscription],
      itemType:[Image, Video],
      clipStoreStatus:[On,Off],
      userName:$userName
      }) {
      status
      message
      body{
        id
        itemStatus
        itemType
        memberId
        title
        description
        duration
        price
        clipStoreStatus
        warningStatus
      }
    }
  }`,
    variables: {
      memberId: creatorId(),
      userName: userName(),
    },
  });
  const res = http.post(`https://media-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  check(res, { 'have public items': (r) => r.body.includes('Public') });
  check(res, { 'have warningStatus items': (r) => r.body.includes('warningStatus') });
  check(res, { 'have price  items': (r) => r.body.includes('price') });
  sleep(1);
}
