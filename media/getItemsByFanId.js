import http from 'k6/http';
import { sleep, check } from 'k6';
import { fanId } from '../modules/authModule.js';
import { userName } from '../modules/hotlineModule.js';
import { creatorId, creatorToken } from '../modules/authModule.js';
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
};

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  // const memberId ='a36a29eb-27c0-4f77-9a11-95ca52f48d1d' // owner
  // the member ID is different from owner
  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };

  const postData = JSON.stringify({
    query: `query getItems($memberId:String!, $userName:String!){
      getItems(data: { memberId: $memberId,
        filter: [ Follower, Subscription, Public ],
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
          url
        }
      }
    }`,
    variables: {
      memberId: fanId(),
      userName: userName(),
    },
  });
  const res = http.post(`https://media-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
