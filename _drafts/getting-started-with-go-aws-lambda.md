---
layout: post
title: Getting Started with Go AWS Lambda
description: A guide to creating serverless functions with Go using the AWS SDK and the AWS CLI.
keywords: go, golang, AWS, cli, aws cli, api, api gateway, cloudwatch, logs, lambda, aws-sdk-go, serverless, serverless function, sdk
tags: Go
category: Go
hero_image:
  src: '/static/images/getting-started-with-go-aws-lambda/go-aws-lambda_hero--825x464.png'
  alt: "Illustration of the phrase 'Go Lambda'"
og_image: '/static/images/getting-started-with-go-aws-lambda/go-aws-lambda_hero--1200x600.png'
---

Serverless functions, or Functions as a Service (FaaS), are functions deployed individually and executed on a server managed by a cloud provider. They're part of a broader model called _serverless architecture_ or _serverless computing_ and can offer significant benefits in certain scenarios.

I recently used a serverless function to process a lead form submission for a marketing site. For this common task, I would usually create a VPS (virtual private server) to host the marketing site and handle the form submission in the same VPS on the backend. But spooling up a dedicated VPS for a simple marketing site, which is mostly static, is wasteful. It's the type of site that could easily be deployed statically, using something like a CDN. It's an ideal scenario for serverless functions.

There are several benefits to the serverless model applicable in this scenario. One of the biggest advantages—and something that makes this a compelling sale to stakeholders—is a significant cost reduction. The price model for AWS's VPS, EC2, is complex and multidimensional. Cost is determined by several parameters, including resource size, run time, CPU utilization, etc. At a simple level, it boils down to a VPC instance running 24/7. You incur charges the entire time, even if the server is idle.

Serverless functions have a simpler cost structure where the price is determined by the number of invocations, run time, and memory use. When a serverless function is invoked, you incur a single charge. It's a _per-request_ model versus a _per hour_ model, like a 'pay-as-you-go' model. Idle time is basically free.

There are more benefits (and drawbacks) to the serverless model that I won't cover here. For more information, I recommend Mike Roberts' comprehensive [article on serverless architectures](https://www.martinfowler.com/articles/serverless.html).

In this guide I cover the basics of getting started with serverless functions using Go and AWS.

## Go AWS Lambda Workflow

Several providers support creating serverless functions using Go, including Google, IBM, and AWS. I use AWS Lambda (their brand name for FaaS) in this example because we have a lot of existing infrastructure through AWS.

Apart from Go itself, there are several components in the serverless workflow:

- **aws-sdk-go** - Official AWS SDK for Go.
- **AWS CLI** - Used to manage AWS from the command line.
- **AWS Lambda** - Service that executes serverless functions.
- **API Gateway** - Used to map HTTP REST endpoints to lambda functions.
- **CloudWatch** - Used to log information from lambda functions.

## Creating an AWS Lambda Function in Go

Writing Lambda functions is simple. Creating a lambda entry point involves calling the `Start` function from the `lambda` package in the [AWS SDK for Go](https://github.com/aws/aws-sdk-go). The `Start` method takes a handler function as its single argument.

There are several valid function signatures for the handler function. With a context argument, the handler function has access to the invocation context, which includes information on the environment, client, etc. With an events argument, the handler has access to information specific to the request, or event, that triggered the function.

The basic structure for a lambda function:

```go
// main.go
package main

import "github.com/aws/aws-lambda-go/lambda"

func handler() {}

func main() {
  lamdba.Start(handler)
}
```

### An Example Lambda Function

In the following example, we process a basic lead form submission from an HTTP request. Our request body has a `lead` as a `JSON` encoded string. Our response will return the `lead` and a timestamp as a `JSON` encoded string.

The handler function, `handleLead`, accepts an API Gateway request event as its only argument and returns an API Gateway response and error. The API Gateway **request** has typical HTTP request data, such as headers, query params, a body, etc. The API Gateway **response** can accept typical HTTP response data, such as a status code, headers, a body, etc. This function is going to be invoked via the API Gateway. If we were expecting a different service to invoke the function, such as a database, we might use the `DynamoDBEvent`, also from the `events` package.

Within the handler function, we'll log the request body. The lambda function uses CloudWatchLogs as its standard logger.

If the lead request can be unmarshaled and we encounter no errors, we return a response with the lead data, timestamp, and a successful status code. Otherwise, we log an error and respond with a server error status code.

```go
// main.go
package main

import (
  "encoding/json"
  "github.com/aws/aws-lambda-go/events"
  "github.com/aws/aws-lambda-go/lambda"
  "log"
  "net/http"
  "time"
)

type lead struct {
  Name  string `json:"name"`
  Email string `json:"email"`
}

type response struct {
  Lead      lead      `json:"lead"`
  Timestamp time.Time `json:"timestamp"`
}

func handleLead(request events.APIGatewayProxyRequest) (
  res events.APIGatewayProxyResponse, err error) {
  log.Printf("INFO: body: %s", request.Body)
  var l lead
  // unmarshal the request body into a lead struct and
  // log and return an error code if it fails
  if err := json.Unmarshal([]byte(request.Body), &l); err != nil {
    log.Printf("ERROR: unable to unmarshal request: %s", err.Error())
    res.StatusCode = http.StatusInternalServerError
    return res, err
  }

  // form a response using the lead request data and the current time
  resp := &response{
    Lead:      l,
    Timestamp: time.Now().UTC(),
  }
  body, err := json.Marshal(resp)
  if err != nil {
    log.Printf("ERROR: unable to marshal request: %s", err.Error())
    res.StatusCode = http.StatusInternalServerError
    return res, err
  }

  // finally return the response with a 200 status code
  res.Body = string(body)
  res.StatusCode = http.StatusOK
  return res, nil
}

func main() {
  lambda.Start(handleLead)
}

```

And that's a super basic lambda function. To invoke it, we need to build and deploy it.

## Deploying Lambda Functions

### IAM and Policies

Before running, Lambda functions need to have permissions set. Permissions in AWS are defined by IAM roles and policies. A function assumes a role, which has policies attached. For example, if we wanted to send an email from our lambda function via AWS' Simple Email Service (SES), we'd need to give our Lambda access to the SES service.

We're going to create a simple role for executing lambda functions and attach policies to the role allowing it to access resources.

The following example passes a trust policy via a local file, but it can also be inlined with the `--cli-input-json` flag.

> Note: there are several places where `{iam}` is used as a placeholder for the IAM user ID. Use the appropriate IAM user ID instead.

```sh
$ aws iam create-role --role-name lambda-simple \
--assume-role-policy-document file://trust-policy.json
{
    "Role": {
        "Path": "/",
        "RoleName": "lambda-simple",
        "RoleId": "AROA3FQMJ0I5QSHLOZXN5",
        "Arn": "arn:aws:iam::{iam}:role/lambda-simple",
        "CreateDate": "2020-06-25T02:00:07Z",
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "lambda.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
    }
}
```

A simple trust policy for AWS Lambda:

```jsonc
// trust-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

After the role has been created, we can attach any number of policies to it. We'll attach policies allowing the function to execute and access CloudWatch Logs.

> Note: these commands don't return output if the operation was successful.

Attach a policy allowing the function to execute:

```sh
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AWSLambdaExecute \
--role-name lambda-simple
```

Attach a policy allowing the function to access CloudWatch Logs:

```sh
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess \
--role-name lambda-simple
```

With these policies in place, we'll next build and upload the function.

### Build Lambda and Upload

Go Lambda functions are run from a binary compiled for Linux. The binary must be included in a zip file along with any dependent assets. In this example, there's a single _main_ binary, but if we needed to include other files such as templates, we'd add them to the zip archive as well.

Building on Linux is straightforward: we build a binary from our main.go file and zip it.

#### Build On Linux

```sh
go build main main.go
zip main.zip main
```

Building on Windows is more involved because of the way Windows handles file permissions. The Lambda function is executed on Linux and needs open execution permissions.

To get around this, use the zip tool included in the aws-lambda-go package. The zip tool adds the appropriate permissions to the binary before zipping.

#### Build On Windows

```sh
# get the zip tool
go get -u github.com/aws/aws-lambda-go/cmd/build-lambda-zip
# build for linux
set GOOS=linux
go build -o main main.go
# create a zip file with the zip tool
%userprofile%/Go/bin/build-lambda-zip.exe -o main.zip main
```

With the zip containing the built application, we can create the AWS Lambda function with the zip file.

```sh
$ aws lambda create-function --function-name lambda-lead \
--runtime go1.x \
--zip-file fileb://main.zip \
--handler main \
--role arn:aws:iam::{iam}:role/lambda-simple
{
    "FunctionName": "lambda-lead",
    "FunctionArn": "arn:aws:lambda:us-west-2:{iam}:function:lambda-lead",
    "Runtime": "go1.x",
    "Role": "arn:aws:iam::{iam}:role/lambda-simple",
    "Handler": "main",
    "CodeSize": 5158043,
    "Description": "",
    "Timeout": 3,
    "MemorySize": 128,
    "LastModified": "2020-06-23T02:11:54.120+0000",
    "CodeSha256": "B6tVYAT+GFuA1QhvGB7k+FHQqZzSzkFSd1p2yypvM5U=",
    "Version": "$LATEST",
    "TracingConfig": {
        "Mode": "PassThrough"
    },
    "RevisionId": "9f3af20e-f1g2-4271-a4f1-3gh850bfa7ac",
    "State": "Active",
    "LastUpdateStatus": "Successful"
}
```

Keep a note of the `FunctionArn` value returned. It's going to be used when creating the API Gateway.

To update an already deployed Lambda function, build and zip the function as previously described. Then use the `update-function-code` command. Only the lambda function name and a path to the zip file are required.

```sh
aws lambda update-function-code --function-name lambda-lead --zip-file fileb://main.zip
```

## Invoking Lambda with HTTP

The `--target` is the ARN of the function created in the previous section (the value for `FunctionArn`).

```sh
$ aws apigatewayv2 create-api --name lambda-lead \
--protocol-type HTTP \
--target arn:aws:lambda:us-west-2:{iam}:function:lambda-lead
{
    "ApiEndpoint": "https://k4sdfh89l.execute-api.us-west-2.amazonaws.com",
    "ApiId": "k4sdfh89l",
    "ApiKeySelectionExpression": "$request.header.x-api-key",
    "CreatedDate": "2020-06-25T02:14:41Z",
    "Name": "lambda-lead",
    "ProtocolType": "HTTP",
    "RouteSelectionExpression": "$request.method $request.path"
}
```

Keep a note of the `ApiEndpoint` and `ApiId` values returned. They identify the API and endpoints for requests.

Finally, the API Gateway needs permission to invoke its associated lambda function. We give it permission by updating the lambda's resource policy:

```sh
aws lambda add-permission --statement-id lamba-lead-api-gateway-permission \
--action lambda:InvokeFunction \
--function-name arn:aws:lambda:us-west-2:{iam}:function:lambda-lead \
--principal apigateway.amazonaws.com \
--source-arn "arn:aws:execute-api:us-west-2:{iam}:k4sdfh89l/*/$default"
```

### Test

Now that the lambda function is fully deployed, we can test accessing it via HTTP. We'll make a `curl` request to the API endpoint with test lead data. Our endpoint returns the lead along with a timestamp. Success!

```sh
$ curl -H "Content-Type: application/json" \
-d "{\"name\": \"Testy\", \"email\": \"test@test.com\"}" \
https://k4sdfh89l.execute-api.us-west-2.amazonaws.com
{"lead":{"name":"Testy","email":"test@test.com"},"timestamp":"2020-06-19T03:40:29.451817088Z"}
```

You can verify that your lambda invocation was logged to CloudWatch by listing the log streams for the log group, named for the lambda function:

```sh
aws logs describe-log-streams --log-group-name "/aws/lambda/lambda-lead"
```

You can see the request body that we submitted by inspecting a particular log stream:

```sh
aws logs get-log-events --log-group-name "/aws/lambda/lambda-lead" \
--log-stream-name 2020/06/25/[$LATEST]3c93779ddb224i6982fg4e3cb928c2f5
```

## Next Steps

In this guide, we created a simple serverless function using Go. We deployed our function and set up an API endpoint to access it via HTTP. This covers a lot of ground, yet it's only a start. There's plenty of room for improvement.

You can [validate the request](/article/go-input-validation-and-testing) as part of the request processing.
