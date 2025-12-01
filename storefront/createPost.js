import http from 'k6/http';
import { sleep, check } from 'k6';
import { creatorId, creatorToken } from '../modules/authModule.js';

export const options = {
  // stages: [
  //   { duration: '90s', target: 5 }, // simulate ramp-up of traffic
  //   { duration: '180s', target: 100 }, // stay at 100 users for 10 minutes
  //   { duration: '90s', target: 0 }, // ramp-down to 0 users
  // ],
};
export default function () {
  const accessToken = __ENV.K6_ACCESS_TOKEN || creatorToken();
  const DOMAIN = __ENV.K6_DOMAIN || '4idps-demo1.com';

  const headers = {
    'access-token': accessToken,
    'Content-Type': 'application/json',
  };

  const createPostData = JSON.stringify({
    query: `mutation {
      createPost(
        data: {isPinned:true,postContent:"smoke Test"
        }
      ) {
        status
        message
      }
    }
    
    `,
    variables: {},
  });

  const createPostRes = http.post(`https://storefront-backend.${DOMAIN}/graphql`, createPostData, {
    headers: headers,
  });
  check(createPostRes, { 'Create Post SUCCESS': (r) => r.body.includes('SUCCESS') });

  const getProfilePosts = JSON.stringify({
    query: `query getProfilePosts($creatorId: String!) {
      getProfilePosts(creatorId: $creatorId) {
        status
        message
        body{
          posts{
            id
          }
        }
      }
    }
    `,
    variables: {
      creatorId: creatorId(),
    },
  });

  const getProfilePostsRes = http.post(`https://storefront-backend.${DOMAIN}/graphql`, getProfilePosts, {
    headers: headers,
  });
  check(getProfilePostsRes, {
    'get feed posts successfully': (r) => r.body.includes('SUCCESS'),
  });
  const postId = getProfilePostsRes.json().data.getProfilePosts.body.posts[0].id;
  const removePost = JSON.stringify({
    query: `mutation removePost($postId: String!) {
      removePost(postId: $postId) {
        status
        message
      }
    }
  `,
    variables: {
      postId: `${postId}`,
    },
  });

  const removePostRes = http.post(`https://storefront-backend.${DOMAIN}/graphql`, removePost, {
    headers: headers,
  });
  check(removePostRes, {
    'remove feed post successfully': (r) => r.body.includes('SUCCESS'),
  });
  sleep(1);
}
