import http from 'k6/http';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { sleep, check } from 'k6';
import { creatorToken } from '../modules/authModule.js';
const img1 = open('../avatar.jpg', 'b');

export default function () {
  const options = {};
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const fd = new FormData();
  fd.append('file', http.file(img1, 'image1.jpg', 'image/jpeg'));
  fd.append('mediaType', 'ProfileAvatar');
  const headers = {
    'access-token': accessToken,
    'Content-Type': 'multipart/form-data; boundary=' + fd.boundary,
  };

  const uploadAvatarRes = http.post(`https://media-backend.${DOMAIN}/media/uploadProfileToS3`, fd.body(), {
    headers: headers,
  });
  check(uploadAvatarRes, {
    'has avatar url': (r) => r.body.includes('profile_avatar_url'),
  });

  sleep(1);
}
