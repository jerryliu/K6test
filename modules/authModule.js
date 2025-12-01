import http from 'k6/http';

export const options = {};

const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

const getCreatorId = JSON.stringify({
  query: `query{
    getMemberId(walletAddress:"9XNpQoexJ1vHsaM5FgTWPomZXbRSwzeK4Z8HUogze1EP"){
      status
      message
      body{
        memberId
      }
    }
  }`,
  variables: {},
});
const getFanId = JSON.stringify({
  query: `query{
    getMemberId(walletAddress:"FWamdjPLK4x2mYzmLySFZybvBMc1qCfCrdU4uJzXjGjQ"){
      status
      message
      body{
        memberId
      }
    }
  }`,
  variables: {},
});

const headers = {
  'access-token': '',
  'Content-Type': 'application/json',
};

const getCreateToken = JSON.stringify({
  query: `mutation Login(
    $loginType: LoginTypeEnum!
    $publicKey: String!
    $ip: String! 
  ) {
    login(
      loginInput: {
        loginType: $loginType
        publicKey: $publicKey
         ip: $ip
       }
    ) {
      body {
        accessToken
      }
      message
      status
    }
  }
  `,
  variables: {
    ip: '118.163.7.197',
    loginType: 'Particle',
    publicKey: '9XNpQoexJ1vHsaM5FgTWPomZXbRSwzeK4Z8HUogze1EP',
  },
});

export function creatorId() {
  const res = http.post(`https://auth-backend.${DOMAIN}/graphql`, getCreatorId, {
    headers: headers,
  });
  console.log('res.json().data.getMemberId.body', res.json().data.getMemberId.body);
  return res.json().data.getMemberId.body.memberId;
}

export function creatorToken() {
  const res = http.post(`https://auth-backend.${DOMAIN}/graphql`, getCreateToken, { headers: headers });
  return res.json().data.login.body.accessToken;
}

export function fanToken() {
  const res = http.post(`https://auth-backend.${DOMAIN}/graphql`, getFanId, {
    headers: headers,
  });
  return res.json().data.getMemberId.body.memberId;
}

export function fanId() {
  const res = http.post(`https://auth-backend.${DOMAIN}/graphql`, getFanId, {
    headers: headers,
  });
  return res.json().data.getMemberId.body.memberId;
}
