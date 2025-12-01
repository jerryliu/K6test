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

  const getChatRoomIdQuery = JSON.stringify({
    query: `query chatRoom($memberId:ID!){
      chatRoom(
        creatorId:$memberId){
          message
          status
          body{
            id
          }
      }
    }`,
    variables: { memberId: creatorId() },
  });
  const chatRoomIdRes = http.post(`https://chat-backend.${DOMAIN}/graphql`, getChatRoomIdQuery, {
    headers: headers,
  });
  check(chatRoomIdRes, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  check(chatRoomIdRes, {
    'get chat room id successfully': (r) => r.body.includes('id'),
  });
  const chatRoomId = chatRoomIdRes.json().data.chatRoom.body.id;
  console.log('chatRoomId---', chatRoomId);
  // sleep(1);

  const postData = JSON.stringify({
    query: `query chatRoomByChatRoomId($chatRoomId:ID!){
      chatRoomByChatRoomId(chatRoomId:$chatRoomId){
        status
        message
      }
    }`,
    variables: { chatRoomId: chatRoomId },
  });
  const res = http.post(`https://chat-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'get chatRoomByChatRoomId successfully': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
