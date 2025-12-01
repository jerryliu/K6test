import http from 'k6/http';
import { sleep, check } from 'k6';
import { AWSConfig, SecretsManagerClient } from 'https://jslib.k6.io/aws/0.6.0/secrets-manager.js';
// import { itemId } from '../modules/mediaModule.js';
export const options = {
  thresholds: {
    // During the whole test execution, the error rate must be lower than 1%.
    http_req_failed: ['rate<0.01'],
  },
  vus: 1,
  duration: '1s',
};

console.log('-------__ENV.HOTLINE_AWS_ACCESS_KEY_ID', __ENV.HOTLINE_AWS_ACCESS_KEY_ID);
console.log('-------__ENV.PROD_HOTLINE_AWS_SECRET_ACCESS_KEY', __ENV.HOTLINE_AWS_SECRET_ACCESS_KEY);
// console.log('-------__ENV.AWS_REGION', __ENV.AWS_REGION);

const awsConfig = new AWSConfig({
  // region: __ENV.AWS_REGION || 'ap-northeast-1',
  region: 'eu-central-1',
  accessKeyId: __ENV.HOTLINE_AWS_ACCESS_KEY_ID,
  secretAccessKey: __ENV.HOTLINE_AWS_SECRET_ACCESS_KEY,
});

const secretsManager = new SecretsManagerClient(awsConfig);
const testSecretName = 'prod_hotline_secrets';
const DOMAIN = 'gethotline.com';

export default function () {
  // const secrets = secretsManager.listSecrets();
  const downloadedSecret = secretsManager.getSecret(testSecretName);
  const API_KEY = JSON.parse(downloadedSecret.secret).HOTLINE_API_KEY;
  const postData = JSON.stringify({
    query: `query getSingleItemApk($itemId:String!){
      getSingleItemApk(data:{itemId:$itemId }){
        status
        message
      }
    }
    `,
    variables: { itemId: 'cbd07a9f-3096-4087-b5ca-39e51a43860c' },
  });

  const headers = {
    'API-KEY': API_KEY,
    'Content-Type': 'application/json',
  };
  const res = http.post(`https://media-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });

  check(res, { 'status SUCCESS': (r) => r.body.includes('SUCCESS') });
  sleep(1);
}
