import http from 'k6/http';
import { sleep, check } from 'k6';
import { creatorId, creatorToken } from '../modules/authModule.js';
import { chatRoomId } from '../modules/chatModule.js';
import { itemId } from '../modules/mediaModule.js';

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
    query: `mutation createMessage($senderId:String!,$chatRoomId:ID!, $ItemId:[String!], $sendAt:DateTime!){
      createMessage(input:{itemIds:$ItemId, 
        sendAt:$sendAt,
        chatRoomId: $chatRoomId,
        senderId:$senderId }){
        message
        status
        body{
          id
        }
      }
    }`,
    variables: {
      senderId: creatorId(),
      chatRoomId: chatRoomId(),
      sendAt: '2023-04-21T01:37:56.825Z',
      ItemId: [itemId()],
    },
  });

  const res = http.post(`https://chat-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  check(res, { 'create message successfully': (r) => r.body.includes('id') });

  sleep(1);
}
