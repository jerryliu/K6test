import http from 'k6/http';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { sleep, check } from 'k6';
import { creatorToken } from '../modules/authModule.js';
export const options = {};

// const img1 = open('0')
const bkImg = open('../background.png', 'b');

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const fd = new FormData();
  fd.append('file', http.file(bkImg, 'image1.jpg', 'image/jpeg'));
  fd.append('mediaType', 'ProfileBackground');

  const headers = {
    'access-token': accessToken,
    'Content-Type': 'multipart/form-data; boundary=' + fd.boundary,
  };
  const uploadBackgroundRes = http.post(
    `https://media-backend.${DOMAIN}/media/uploadProfileToS3`,
    fd.body(),
    {
      headers: headers,
    },
  );
  check(uploadBackgroundRes, {
    'has background url': (r) => r.body.includes('profile_background_url'),
  });

  sleep(1);
}
