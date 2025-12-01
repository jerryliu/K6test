import http from 'k6/http';
import { sleep, check } from 'k6';
import { itemId } from '../modules/mediaModule.js';
import { creatorToken } from '../modules/authModule.js';

export const options = {};

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };

  const getSingleItem = JSON.stringify({
    query: `query getSingleItem($itemId:String!){
      getSingleItem(data: { itemId: $itemId }) {
        status
        message 
        body{
          blurredUrl
          itemStatus
          itemType
          url
        }
    
      }
    }`,
    variables: {
      // itemId: 'b04974d9-b75b-4e46-8b33-2d0414b40fab',
      itemId: itemId(),
    },
  });
  const getSingleItemRes = http.post(`https://media-backend.${DOMAIN}/graphql`, getSingleItem, {
    headers: headers,
  });
  check(getSingleItemRes, { 'get single item success': (r) => r.body.includes('SUCCESS') });

  sleep(1);
}
