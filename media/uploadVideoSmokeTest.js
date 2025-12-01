import http from 'k6/http';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { sleep, check } from 'k6';
import { creatorToken } from '../modules/authModule.js';

export const options = {
  // stages: [
  //   { duration: '90s', target: 5 }, // simulate ramp-up of traffic
  //   { duration: '180s', target: 100 }, // stay at 100 users for 10 minutes
  //   { duration: '90s', target: 0 }, // ramp-down to 0 users
  // ],
};
const video = open('../video.mp4', 'b');

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const postData = JSON.stringify({
    query: `mutation{
    getMultiSignedUrl(mediaList:[{type:"Video",mimeType:"mp4",parts:1}]){
      status
      message
      body{
        uploadId
        itemId
        url
  
      }
    }
  }
  `,
    variables: {},
  });

  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };

  const res = http.post(`https://media-backend.${DOMAIN}/graphql`, postData, {
    headers: headers,
  });
  check(res, { 'service status OK': (r) => r.body.includes('SUCCESS') });
  check(res, {
    'create signed url successfully': (r) => res.json('itemId') !== '',
  });

  const data = new FormData();
  data.append('file', http.file(video, 'video.mp4', 'video/mp4'));
  const videoFile = video;
  const uploadUrl = res.json().data.getMultiSignedUrl.body[0].url[0];
  const videoHeaders = {
    'Content-Type': 'multipart/form-data; boundary=' + data.boundary, // PNG
  };

  const uploadRes = http.put(uploadUrl, videoFile, { headers: videoHeaders });
  check(uploadRes, { 'upload Video successfully': (r) => r.Etag !== '' });

  const Etag = uploadRes.headers['Etag'];
  const itemId = res.json().data.getMultiSignedUrl.body[0].itemId;
  const uploadId = res.json().data.getMultiSignedUrl.body[0].uploadId;

  const setMultiUploadCompleteApi = JSON.stringify({
    query: `mutation{
    setMultiUploadComplete(data:{
      UploadId:"${uploadId}", 
      type:"Video",
      itemId:"${itemId}",
      list:[{ETag:${Etag}, PartNumber:1}]})
    {
      status
      message
    }
  }  
  `,
    variables: {},
  });

  const setMultiUploadCompleteRes = http.post(
    `https://media-backend.${DOMAIN}/graphql`,
    setMultiUploadCompleteApi,
    {
      headers: headers,
    },
  );
  check(setMultiUploadCompleteRes, {
    'set multi Upload complete successfully': (r) => r.body.includes('SUCCESS'),
  });

  ////
  const setDismissApi = JSON.stringify({
    query: `mutation($itemId: String!) {
    dismissWarningItems(data:{items:[$itemId]}) {
      status
      message
    }
  }
  `,
    variables: {
      itemId: `${itemId}`,
    },
  });
  const setDismissRes = http.post(`https://media-backend.${DOMAIN}/graphql`, setDismissApi, {
    headers: headers,
  });
  check(setDismissRes, { 'dismiss Warning items SUCCESS': (r) => r.body.includes('SUCCESS') });

  ////

  sleep(3);
}
