import http from 'k6/http';
import { creatorToken } from './authModule.js';

export const options = {};

// const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
// const accessToken =
//   __ENV.K6_ACCESS_TOKEN ||
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6ImEzNmEyOWViLTI3YzAtNGY3Ny05YTExLTk1Y2E1MmY0OGQxZCIsInB1YmxpY0tleSI6IjlYTnBRb2V4SjF2SHNhTTVGZ1RXUG9tWlhiUlN3emVLNFo4SFVvZ3plMUVQIiwiYWdlbnRJZCI6bnVsbCwiaWF0IjoxNjg1NTA1NjU2LCJleHAiOjIwODU1MDU3NzZ9.FF-gXRrpNbPYTNILjLeAHjZi_oRHGjDGU4abVhioTMA';
// const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

// const headers = {
//   'access-token': accessToken,
//   'Content-Type': 'application/json',
// };

export function userName() {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };
  console.log(accessToken);
  const getPrivateProfile = JSON.stringify({
    query: `{
      getPrivateProfile{
        status
        message
        body {
          memberId
          userName
        }
      }
    }
    `,
    variables: {},
  });

  const res = http.post(`https://storefront-backend.${DOMAIN}/graphql`, getPrivateProfile, {
    headers: headers,
  });
  return res.json().data.getPrivateProfile.body.userName;
}
export function tierId() {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };
  const postData = JSON.stringify({
    query: `query getTierPassSettingList($userName:String!){
      getTierPassSettingList(data:{
        userName: $userName
      }){
      status
      message
      body{
        id
        allowDms
        tierName
        memberId
        tierPass{
          id
          duration
          passStatus
        }
          tierPrice
          quantity      
      }
    }
  }`,
    variables: { userName: userName() },
  });

  const res = http.post(`https://storefront-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  return res.json().data.getTierPassSettingList.body[0].id;
}

export function tierPassId() {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };
  const postData = JSON.stringify({
    query: `query getTierPassSettingList($userName:String!){
      getTierPassSettingList(data:{
        userName: $userName
      }){
      status
      message
      body{
        id
        allowDms
        tierName
        memberId
        tierPass{
          id
          duration
          passStatus
          quantity
          tierPrice
        }
          tierPrice
          quantity      
      }
    }
  }`,
    variables: { userName: userName() },
  });

  const res = http.post(`https://storefront-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  return res.json().data.getTierPassSettingList.body[0].tierPass[0].id;
}

export function referralCode() {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };
  const postData = JSON.stringify({
    query: `query {
      getReferralInfo{
      status
      message
        body{
          referralCount
          referralUrl
          rewardTotal
          referralList{
            createdAt
            userName
          }
          
        }
    }
  }`,
    variables: {},
  });

  const res = http.post(`https://storefront-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  const referralCode = res.json().data.getReferralInfo.body.referralUrl.split('=')[1];
  return referralCode;
}
