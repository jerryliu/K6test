# Performing Smoke Tests with K6 on GitHub Actions

This guide will walk you through the process of setting up and running smoke tests using K6 on GitHub Actions. Smoke tests help verify that critical functionalities of Hotline micro-services are working as expected after deployment.

## Prerequisites

Before getting started, ensure you have the following:

- Allow access the GitHub repository link: https://github.com/superlayer/hotline-test-backend
- Access token from hotline application

## Step 1: Trigger Smoke Tests

With the workflow in place, smoke tests will automatically run on each push to the specified branch. To manually trigger the smoke tests:

1. Navigate to the "Actions" (https://github.com/superlayer/hotline-test-backend/actions).
2. Select the "Run Load Test" on the left side.
3. Click on "Run workflow" on the right side
4. First input field is for which service you want to test
5. Please input your access token into the second field
6. Please input which domain you want to test ( ex: hotline-qa.io)

The workflow will execute the defined steps, including checking out the code, setting up Node.js, installing dependencies, and running the smoke tests using K6.

## Check the outcome

1. After Run Load Test is finished, click it and Click run-loadtest, you can find the nine test steps, please click step six 'Run load test',
2. Please check the smoke result by each

```
running (00m03.0s), 0/1 VUs, 1 complete and 0 interrupted iterations
default ✓ [ 100% ] 1 VUs  00m03.0s/10m0s  1/1 iters, 1 per VU
Running getCreatorList.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: storefront/getCreatorList.js
     output: -

  scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
           * default: 1 iterations for each of 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)


running (00m01.0s), 1/1 VUs, 0 complete and 0 interrupted iterations
default   [   0% ] 1 VUs  00m01.0s/10m0s  0/1 iters, 1 per VU

     ✓ status SUCCESS

     checks.........................: 100.00% ✓ 1        ✗ 0
     data_received..................: 5.9 kB  3.4 kB/s
     data_sent......................: 1.1 kB  626 B/s
     http_req_blocked...............: avg=509.2ms  min=509.2ms  med=509.2ms  max=509.2ms  p(90)=509.2ms  p(95)=509.2ms
     http_req_connecting............: avg=160.06ms min=160.06ms med=160.06ms max=160.06ms p(90)=160.06ms p(95)=160.06ms
     http_req_duration..............: avg=207.71ms min=207.71ms med=207.71ms max=207.71ms p(90)=207.71ms p(95)=207.71ms
       { expected_response:true }...: avg=207.71ms min=207.71ms med=207.71ms max=207.71ms p(90)=207.71ms p(95)=207.71ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 1
     http_req_receiving.............: avg=87.4µs   min=87.4µs   med=87.4µs   max=87.4µs   p(90)=87.4µs   p(95)=87.4µs
     http_req_sending...............: avg=320.5µs  min=320.5µs  med=320.5µs  max=320.5µs  p(90)=320.5µs  p(95)=320.5µs
     http_req_tls_handshaking.......: avg=327.54ms min=327.54ms med=327.54ms max=327.54ms p(90)=327.54ms p(95)=327.54ms
     http_req_waiting...............: avg=207.3ms  min=207.3ms  med=207.3ms  max=207.3ms  p(90)=207.3ms  p(95)=207.3ms
     http_reqs......................: 1       0.582118/s
     iteration_duration.............: avg=1.71s    min=1.71s    med=1.71s    max=1.71s    p(90)=1.71s    p(95)=1.71s
     iterations.....................: 1       0.582118/s
     vus............................: 1       min=1      max=1
     vus_max........................: 1       min=1      max=1

```

## Local Testing (optional)

If you want to test the smoke tests locally before committing them to the repository, you can use Docker. Here's how you can run the tests locally:

1. Install Docker on your local machine if you haven't already.
2. Open a terminal or command prompt.
3. Run the following command, replacing `path/to/smoke-test.js` with the path to your K6 script:

```bash
# for mac environment
brew install k6
k6 run -e K6_DOMAIN=gethotline.com storefront/createPost.js
```

Ensure you have the necessary dependencies installed within your K6 script.

---

Feel free to customize the instructions and example script to fit your specific application and testing needs. Good luck with your smoke tests!
