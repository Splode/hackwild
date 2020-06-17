---
layout: post
title: Getting Started with Go AWS Lambda
description: Creating serverless functions with Go using the AWS SDK.
keywords: go, golang, AWS, lambda, aws-sdk-go, serverless, serverless function, REST, sdk
tags: Go
category: Go
hero_image:
  src: '/static/images/getting-started-with-go-aws-lambda/go-aws-lambda_hero--825x464.png'
  alt: "Illustration of the phrase 'Validation, testing and validating input in Go'"
og_image: '/static/images/getting-started-with-go-aws-lambda/go-aws-lambda_hero--1200x600.png'
---

One example scenario, and one that I've recently worked through, is using a serverless function to process a lead form submission for a marketing site. For this common task, I would usually create a VPS (virtual private server) to host the marketing site and handle the form submission in the same VPS on the backend. But spooling up a dedicated VPS for a simple marketing site, which is mostly static, is wasteful. It's the type of site that could easily be deployed statically, using something like a CDN. It's an ideal scenario for serverless functions.

There are several benefits to the serverless model applicable in this scenario. One of the biggest advantages—and something that makes this a compelling sale to stakeholders—is a significant cost reduction. The price model for AWS's VPS, EC2, is complex and multidimensional. Cost is determined by several parameters, including resource size, run time, CPU utilization, etc. At a simple level, it boils down to a VPC instance running 24/7. You encur charges the entire time, even if the server is idle.

Serverless functions have a simpler cost structure where price is determined by number of invocations, run time, and memory use. When a serverless function is invoked, you encur a single charge. It's a _per request_ model versus a _per hour_ model, like a 'pay-as-you-go' model. Idle time is basically free.

There are more benefits (and drawbacks) to the serveless model that I won't cover here. For more information, I recommend Mike Roberts' comprehensive [article on serverless architectures](https://www.martinfowler.com/articles/serverless.html).

## Go AWS Lambda Workflow

Key components in this workflow:

- AWS CLI
- AWS Lambda
- API Gateway
- CloudWatch

## Creating an AWS Lambda Function in Go

Writing AWS Lambda functions in Go involves using the AWS SDK for go.

- HandlerFunc
  - Context
  - Event (API gateway)

## Deploying Lambda Functions

### IAM and Policies

- AWS Lambda
- SES (optional)

### Build Lambda and Upload

Zip tool
CLI

## Access Lambda using HTTP REST

API Gateway
HTTP methods
CORS

## Next Steps

Form validation
SES email
