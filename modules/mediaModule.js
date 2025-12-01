import http from 'k6/http';
import { creatorId, creatorToken } from './authModule.js';
import { userName } from './hotlineModule.js';

export const options = {};

export function itemId() {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };

  const getItems = JSON.stringify({
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
        }
      }
    }`,
    variables: {
      memberId: creatorId(),
      userName: userName(),
    },
  });

  const res = http.post(`https://media-backend.${DOMAIN}/graphql`, getItems, {
    headers: headers,
  });
  return res.json().data.getItems.body[0].id;
}
