import http from 'k6/http';
import { sleep, check } from 'k6';
import { AWSConfig, SecretsManagerClient } from 'https://jslib.k6.io/aws/0.6.0/secrets-manager.js';
import { itemId } from '../modules/mediaModule.js';
export const options = {};

const awsConfig = new AWSConfig({
  region: getEnv(__ENV.K6_DOMAIN).region,
  accessKeyId: __ENV.HOTLINE_AWS_ACCESS_KEY_ID,
  secretAccessKey: __ENV.HOTLINE_AWS_SECRET_ACCESS_KEY,
});
const secretsManager = new SecretsManagerClient(awsConfig);
const testSecretName = `${getEnv(__ENV.K6_DOMAIN).env}_hotline_secrets`;
console.log(testSecretName);
console.log(getEnv(__ENV.K6_DOMAIN).region, '-------');
// const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
// const DOMAIN = '4idps-demo1.com';

export function API_KEY() {
  const downloadedSecret = secretsManager.getSecret(testSecretName);
  return JSON.parse(downloadedSecret.secret).HOTLINE_API_KEY;
}

function getEnv(domain) {
  if (domain === 'hotline-qa.io') return { env: 'qa', region: 'ap-southeast-1' };
  if (domain === '4idps-demo6.com') return { env: 'staging', region: 'ap-southeast-1' };
  if (domain === 'gethotline.com') return { env: 'prod', region: 'eu-central-1' };
  return { env: 'dev', region: 'ap-northeast-1' };
}
