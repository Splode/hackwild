---
layout: post
title: Getting Started with Go AWS Lambda
description: Creating serverless functions using the AWS SDK for Go.
keywords: go, golang, AWS, lambda, aws-sdk-go, serverless, serverless function, REST, sdk
tags: Go
category: Go
hero_image:
  src: '/static/images/getting-started-with-go-aws-lambda/go-aws-lambda_hero--825x464.png'
  alt: "Illustration of the phrase 'Validation, testing and validating input in Go'"
og_image: '/static/images/getting-started-with-go-aws-lambda/go-aws-lambda_hero--1200x600.png'
---

One example scenario, and one that I've recently worked through, is using a serverless function to process a lead form submission for a marketing site. For this common task, I would usually create a VPS (virtual private server) to host the marketing site and handle the form submission in the same VPS on the backend. But spooling up a dedicated VPS for a simple marketing site, which is mostly static, is wasteful. It's the type of site that could easily be deployed statically, using something like a CDN. It's an ideal scenario for serverless functions.

- Benefits of serverless
  - Cost reduction
  - Service decoupling

For more information on the serverless model, I recommend Mike Roberts' comprehensive [article on serverless architectures](https://www.martinfowler.com/articles/serverless.html).

## Go AWS Lambda Workflow

- AWS CLI
- AWS Lambda
- API Gateway
- CloudWatch

## Creating an AWS Lambda Function in Go

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
