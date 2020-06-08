---
layout: post
title: Input Validation and Testing in Go
description: Validate and test input for a REST API
keywords: go, golang, input, validation, struct, json, development, backend, input validation, testing
tags: Go
category: Go
---

Intro

## Lead Input

```go
package lead

// Lead represents the lead form POST data.
type Lead struct {
  Name         string `json:"name"`
  Email        string `json:"email"`
  Organization string `json:"organization"`
  Message      string `json:"message"`
  Phone        string `json:"phone"`
  Newsletter   bool   `json:"newsletter"`
}
```

```go
package lead_test

import (
  "encoding/json"
  "github.com/splode/go-input-validation-demo/lead"
  "testing"
)

func TestJSONtoLead(t *testing.T) {
  js := `{"name": "Joe", "email": "joe@example.com", "organization": "Example, Inc.", "message": "I'm interested in learning more about your project.", "phone": "555-555-5555", "newsletter": false}`

  var l lead.Lead
  if err := json.Unmarshal([]byte(js), &l); err != nil {
    t.Errorf("failed to unmarshal lead to JSON: %v", err.Error())
  }

  expected := &lead.Lead{
    Name:         "Joe",
    Email:        "joe@example.com",
    Organization: "Example, Inc.",
    Message:      "I'm interested in learning more about your project.",
    Phone:        "555-555-5555",
    Newsletter:   false,
  }

  if expected.Name != l.Name {
    t.Errorf("expected %v, got %v", expected.Name, l.Name)
  }
  if expected.Email != l.Email {
    t.Errorf("expected %v, got %v", expected.Email, l.Email)
  }
  if expected.Organization != l.Organization {
    t.Errorf("expected %v, got %v", expected.Organization, l.Organization)
  }
  if expected.Message != l.Message {
    t.Errorf("expected %v, got %v", expected.Message, l.Message)
  }
  if expected.Phone != l.Phone {
    t.Errorf("expected %v, got %v", expected.Phone, l.Phone)
  }
  if expected.Newsletter != l.Newsletter {
    t.Errorf("expected %v, got %v", expected.Newsletter, l.Newsletter)
  }
}
```

## Basic Validation

## Injecting Random Test Data
