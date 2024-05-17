## Useful Documentation
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [Serverless Sample SetUp](https://github.com/serverless/examples)
- [AWS SDK javascript doc](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)
- [AWS DynamoDB yaml](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-keyschema.html)

## LEARNING
1. Serverless framework vs SAM vs CDK
- Serverless framework and SAM: YAML-based IaC
- CDK: Code IaaC which supports Intellisense to make it easier

  What's nice is as long as we deploy serverless framework to cloud formation, we can always migrate the infrastructure code from serverless to SAM / CDK via cloud formations IaC Generator: [Reference](https://www.youtube.com/watch?v=zyT4y-rfu7s&list=PLnSOIGN9eVemdR84zM_DbvGsm9LzC-55J)

2. Optimizations
Lambda is billed by execution time, anything to reduce execution time will make it cheaper to run lambda functions:
  - Node.js
    - **callbackWaitsForEmptyEventLoop**
      
      When we're using callback to return the result to the caller, sometimes the lambda function execution doesn't stop immediately, due to Node.js event loop mechanism.

      Node.js is a non blocking event driven architecture, which uses event loop to coordinate events. Event loops uses queues to organise events. So, if there are other events that needs to finish while the function is ready to be returned, it will wait, costing us time and money.

      Solution: set context.callbackWaitsForEmptyEventLoop to False

    - **Reusing connections with HTTP Keep-alive**

      We need to establish TLS handshake with dynamodb (in this example), to use documentClient and do stuff with it. 

      Instead of making this connection every time we want to do something, we can use `HTTP alive` to reuse the connections that are previously opened, which reduces latency.

      [Reference](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html)

    - **Dynamodb timeout problem**

      Here are some timeouts for these services:
      - API Gateway: 29 seconds
      - Lambda: 15 minutes (So, we should set lambda timeout to <29 seconds)
      - DynamoDB: Usually, it's miliseconds latency response

      *Weird DynamoDB behavior:* Sometimes it might take several minutes (maybe 0.0001% chance), but in large scale it's could be a big issue, causing both lambda and api gateway to timeout before dynamodb finishes. 

      Solution: set max retries and timeout for dynamodb. [Reference](https://seed.run/blog/how-to-fix-dynamodb-timeouts-in-serverless-application.html)
