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

We're going to create a basic test, which ensures that our JSON to Lead workflow produces what we expect. We unmarshal a JSON string representing the POST data from a lead form into a Lead struct. We also manually create a struct literal with the same values and compare the two.

```go
package lead_test

import (
  "encoding/json"
  "github.com/splode/go-input-validation-demo/lead"
  "testing"
)

func TestJSONToLead(t *testing.T) {
  js := `{"name": "Joe", "email": "joe@example.com", "organization": "Example, Inc.", "message": "I'm interested in learning more about your project.", "phone": "555-555-5555", "newsletter": false, "products": ["hardware"]}`

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

This test passes, as expected:

```sh
λ go test ./lead -run TestJSONToLead
ok      github.com/splode/go-input-validation-demo/lead 0.178s
```

## Basic Validation

### Setup Validator

Once we have our Lead struct in place, we can attempt to validate its fields. To help with validation, we're going to be using the [go-playground/validator](https://github.com/go-playground/validator) package. The `validator` package provides many useful validation functions and is used by many projects, including the Gin framework.

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

The validator package defines validation rules using field tags. We can augment our existing Lead definition to include validation rules. Add validation rules using the `validate` tag and a predefined rule name, such as "required". Additional rules are delimited by commas, and there are some rules, such as "max", which take arguments. For a complete list of predefined validation rules, see the [validator documentation](https://pkg.go.dev/github.com/go-playground/validator?tab=doc).

Using the `validate` tag, we specify the validation rules for each field we want to validate. Fields that don't have field tags are ignored.

- Name: the name field is required and should only consist of ASCII characters. It's limited to 128 characters.
- Email: the email field is required and should be a valid email format. It's limited to 128 characters.
- Organization: the organization field is _optional_ and limited to 128 characters.
- Message: the message field is _optional_ and limited to 512 characters.

> Note: in reality, you may want to allow for more than just ASCII characters in a name field, especially if names like 'X Æ A-12' increase in popularity. For demonstration, we're going to limit the character type.

```go
// Lead represents the lead form POST data.
type Lead struct {
  Name         string   `json:"name" validate:"required,ascii,max=128"`
  Email        string   `json:"email" validate:"required,email,max=128"`
  Organization string   `json:"organization" validate:"max=128"`
  Message      string   `json:"message" validate:"max=512"`
  Phone        string   `json:"phone"`
  Newsletter   bool     `json:"newsletter"`
  Products     []string `json:"products"`
}
```

We'll handle validation for the remaining fields shortly.

### Validate Method

Validating a lead struct involves passing the struct to the `validate.Struct` method. We want the lead package to handle its own validation, so we'll add a `Validate` method that wraps the validation. This way, we can simply call the Validate method on an instance of lead without having to manage the validator package or pass any arguments.

We'll define a package-level variable `validate` to hold an instance of the validator. In the package's `init` function, we'll construct a new instance of `validate`.

The Validate method takes no arguments and returns a single error or `nil`. Within Validate, we'll call the `Struct` method on the `validate` instance, passing in the current instance of the lead. If the `Struct` method fails to validate the lead, it will return an error. We also need to check the error type to ensure that it's a validation error and not _a failure to validate_. This can happen, for example, if we used an undefined validation tag in the lead definition.

If a call to the Validate method returns no error, we assume the lead has passed validation.

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
    // this check ensures there wasn't an error
    // with the validation process itself
    if _, ok := err.(*validator.InvalidValidationError); ok {
      return err
    }
    return err
  }
  return nil
}
```

### Basic Validation Tests

Now that we have our lead definition, validation rules, and validation method in place we can test validation. First, we'll test that our validation method passes when our lead field values are valid.

```go
// lead_test.go

func TestLeadPassesValidation(t *testing.T) {
  js := `{"name": "Joe", "email": "joe@example.com", "organization": "Example, Inc.", "message": "I'm interested in learning more about your project.", "phone": "555-555-5555", "newsletter": false, "products": ["hardware"]}`

  var l lead.Lead
  if err := json.Unmarshal([]byte(js), &l); err != nil {
    t.Errorf("failed to unmarshal lead to JSON: %v", err.Error())
  }
  if err := l.Validate(); err != nil {
    t.Errorf("expected validation on %v, got %v", l, err)
  }
}
```

Our test passes, as expected:

```sh
λ go test ./lead -run TestLeadPassesValidation
ok      github.com/splode/go-input-validation-demo/lead 0.183s
```

## Injecting Random Test Data

### Testing Random Input

## Validating Nested Data and Arrays

### Testing Slices

## Custom Validation Rules

### Testing Custom Validation
