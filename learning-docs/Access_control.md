## Useful Docs

## Learning

Without Access Controlling methods, the API endpoints can be accessed by anyone. We can use multiple ways to control access:
- API Key
- Lambda Authorizer
- Cognito User Pool Authorizer
- IAM Authorizer
- Others:
    - VPC Enpoints
    - API Gateway Resource Policy
    - Tagged-based Access Control
    - etc 

### API Key
#### What is it & setup
Set API key in API Gateway level to protect routes

**Set Up:**
1. Create an API Key for REST API
2. Create a Usage Plan and set
    1. rate/sec limit, burst, and quota
    2. Add API key to usage plan
    3. Add stage to usage plan
3. Choose each routes and click on API Key enabled. Route will be protected

#### How to call on postman
Header
```
x-api-key = <insert API KEY>
```
#### When should we use API kEY?
##### In general
- Not recommended for authentication and authorization
    - Cuz API key is a static string
        - Anyone can copy and paste and access the API
##### Practical Use case
- Used to enforce throttling limits to the APIs daily quota
- Can be used with other Access Control Methods
    - Lambda authorizer, User Pool Authorizer and IAM
- Can be used in microservices to access internal APIs (From protected environments)

### Lambda Authorizer
#### What is it & setup
Lambda Authorizer is a lambda function which checks the authenticity of the request.

API Gateway will always call the lambda authorizer before triggering the intended lambda function.
1. Authorizer gets the context + token of request params
2. Run lambda function
    - Check validity and expiration of tokens such as id token, access token and refresh token. OR
    - Get info from db for any relevant info to be passed down stream
    - etc
3. Return IAM principal + policy back to API gateway to allow/disallow accessed to the different endpoints
    - This policies are usually cached, so we don't need to call almbda authorizer too many times

**Set Up:**
1. s
    1. s

#### How to call on postman

##### Practical Use case
- Check validity and expiration of tokens such as id token, access token and refresh token.

