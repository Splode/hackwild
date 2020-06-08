---
layout: post
title: Input Validation and Testing in Go
description: Validate and test input for a REST API
keywords: go, golang, input, validation, struct, json, development, backend, input validation, testing
tags: Go
category: Go
---

Intro

## Lead Input Struct

```go
package lead

// Lead represents the lead form POST data.
type Lead struct {
  Name         string   `json:"name"`
  Email        string   `json:"email"`
  Organization string   `json:"organization"`
  Message      string   `json:"message"`
  Phone        string   `json:"phone"`
  Newsletter   bool     `json:"newsletter"`
  Products     []string `json:"products"`
}
```

This is a sanity check, ensuring that our basic JSON string to Lead struct workflow produces what we expect.

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
    Products:     []string{"hardware"},
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
  if expected.Products[0] != l.Products[0] {
    t.Errorf("expected %v, got %v", expected.Products[0], l.Products[0])
  }
}
```

## Basic Validation

### Setup Validator

Once we have our Lead struct in place, we can attempt to validate its fields. To help with validation, we're going to be using the `go-playground/validator` package. The `validator` package is a popular package used by many projects, including the Gin framework.

To add validation with validator, we'll first install the module using `go get`:

```sh
go get github.com/go-playground/validator/v10
```

Then in our lead package, we'll import it:

```go
package lead

import "github.com/go-playground/validator/v10"
...
```

### Validation Tags

The validator package uses defines validation rules using field tags. We can augment our existing Lead definition to include validation rules. Add validation rules using the `validate` tag and a predefined rule name, such as "required". Delimit rule names using commas. For a complete list of predefined validation rules, see the [validator documentation](https://pkg.go.dev/github.com/go-playground/validator?tab=doc).

Using the `validate` tag, we indicate the `Name` field is required and consists only of ASCII characters. We'll also require the email field and specify that it should be a valid email.

> Note: in reality, you may want to allow for more than just ASCII characters in a name field, especially with names like 'X Æ A-12'. For demonstration, we're going to limit the character type.

```go
// Lead represents the lead form POST data.
type Lead struct {
  Name         string   `json:"name" validate:"required,ascii"`
  Email        string   `json:"email" validate:"required,email"`
  Organization string   `json:"organization"`
  Message      string   `json:"message"`
  Phone        string   `json:"phone"`
  Newsletter   bool     `json:"newsletter"`
  Products     []string `json:"products"`
}
```

### Validate Method

Validating our lead struct involves adding a `Validate` method to it. The Validate method is a convenience wrapper for the validator package. 

```go
package lead

import "github.com/go-playground/validator/v10"

var validate *validator.Validate

func init() {
  validate = validator.New()
}

// Validate attempts to validate the lead's values.
func (lead *Lead) Validate() error {
  if err := validate.Struct(lead); err != nil {
    if _, ok := err.(*validator.InvalidValidationError); ok {
      return err
    }
    return err
  }
  return nil
}
```

### Basic Validation Tests

## Injecting Random Test Data

### Testing Random Input

## Validating Nested Data and Arrays

### Testing Slices

## Custom Validation Rules

### Testing Custom Validation
