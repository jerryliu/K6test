import http from 'k6/http';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { sleep, check } from 'k6';
import { creatorId, creatorToken } from '../modules/authModule.js';

export const options = {
  // stages: [
  //   { duration: '90s', target: 5 }, // simulate ramp-up of traffic
  //   { duration: '180s', target: 100 }, // stay at 100 users for 10 minutes
  //   { duration: '90s', target: 0 }, // ramp-down to 0 users
  // ],
};
const bkImg = open('../background.png', 'b');

export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';
  const postData = JSON.stringify({
    query: `mutation{
    getMultiSignedUrl(mediaList:[{type:"Image",mimeType:"jpeg",parts:1}]){
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
  data.append('file', http.file(bkImg, 'image1.jpg', 'image/jpeg'));
  const imageFile = bkImg;
  const uploadImageUrl = res.json().data.getMultiSignedUrl.body[0].url[0];
  const imgHeaders = {
    'Content-Type': 'multipart/form-data; boundary=' + data.boundary, // PNG
  };

  const uploadRes = http.put(uploadImageUrl, imageFile, {
    headers: imgHeaders,
  });
  check(uploadRes, { 'upload image successfully': (r) => r.Etag !== '' });

  const Etag = uploadRes.headers['Etag'];
  const itemId = res.json().data.getMultiSignedUrl.body[0].itemId;
  const uploadId = res.json().data.getMultiSignedUrl.body[0].uploadId;
  const setMultiUploadCompleteApi = JSON.stringify({
    query: `mutation{
    setMultiUploadComplete(data:{
      UploadId:"${uploadId}", 
      type:"Image",
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

  const memberId = creatorId();
  const updateItem = JSON.stringify({
    query: `mutation($itemId:String!, $memberId:String!){
    updateItem(data:
      {
        itemId:$itemId,
        itemStatus:Follower,
        memberId:$memberId,
        title:"update_from_test"
        description:"update_from_test"
      }
    ){
      status
      message
     }
  }`,
    variables: {
      itemId: `${itemId}`,
      memberId: `${memberId}`,
    },
  });

  const updateItemRes = http.post(`https://media-backend.${DOMAIN}/graphql`, updateItem, {
    headers: headers,
  });
  check(updateItemRes, {
    'public the Items successfully': (r) => r.body.includes('SUCCESS'),
  });

  sleep(3);
}
