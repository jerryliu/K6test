import http from 'k6/http';
import { sleep, check } from 'k6';
// import { AWSConfig, SecretsManagerClient } from 'https://jslib.k6.io/aws/0.6.0/secrets-manager.js';
import { itemId } from '../modules/mediaModule.js';
import { API_KEY } from '../modules/unitModule.js';
export const options = {
  thresholds: {
    // During the whole test execution, the error rate must be lower than 1%.
    http_req_failed: ['rate<0.01'],
  },
  vus: 1,
  duration: '1s',
};

export default function () {
  // const secrets = secretsManager.listSecrets();
  // const downloadedSecret = secretsManager.getSecret(testSecretName);
  // const API_KEY = JSON.parse(downloadedSecret.secret).HOTLINE_API_KEY;
  const postData = JSON.stringify({
    query: `query getSingleItemApk($itemId:String!){
      getSingleItemApk(data:{itemId:$itemId }){
        status
        message
      }
    }
    `,
    variables: { itemId: itemId() },
  });

  const headers = {
    'API-KEY': API_KEY(),
    'Content-Type': 'application/json',
  };
  const res = http.post(`https://media-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });

  check(res, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
