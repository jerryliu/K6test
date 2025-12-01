import http from 'k6/http';
import { creatorToken } from './authModule.js';

export const options = {};

export function chatRoomId() {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };

  const getChatRoomId = JSON.stringify({
    query: `query {
      chatRooms {
        message
        status
        body {
          id
        }
      }
    }    
    `,
    variables: {},
  });

  const res = http.post(`https://chat-backend.${DOMAIN}/graphql`, getChatRoomId, {
    headers: headers,
  });
  return res.json().data.chatRooms.body[0].id;
}
