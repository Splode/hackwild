---
layout: post
title: Testing and Validating Input in Go
description: Validate input and
keywords: go, golang, input, validation, struct, json, development, backend, input validation, testing
tags: Go
category: Go
hero_image:
  src: 'hackwild_go-input-validation_hero--825x464.png'
  alt: "Illustration of the phrase 'Validation, testing and validating input in Go'"
og_image: '/static/images/hackwild_go-input-validation_hero--1200x600.png'
---

In a perfect world, before client-submitted data ever made its way to a backend application, it would be fully sanitized, valid, pristine. That doesn't happen

This exercise will explore the process of validating input. We'll be working with a JSON string, similar to what we might encounter in a REST API client request. We'll create validation rules for different input fields and write tests for different input scenarios.

## Lead Input Struct

```go
// lead.go
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

## Basic Validation

### Setup Validator

Once we have our Lead struct in place, we can attempt to validate its fields. To help with validation, we're going to be using the [go-playground/validator](https://github.com/go-playground/validator) package. The `validator` package provides many useful validation functions and is used by many projects, including the Gin framework.

To add validation with validator, we'll first install the module using `go get`:

```sh
go get github.com/go-playground/validator/v10
```

Then in our lead package, we'll import it:

```go
// lead.go
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
// lead.go
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
// lead.go
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

With a lead definition, validation rules, and validation method in place we can test validation. First, we'll test that our validation method passes when our lead field values are valid. We call the `Validate` method on the lead and fail the test if it returns an error.

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

Testing validation success passes as expected:

```sh
λ go test ./lead -run TestLeadPassesValidation
ok      github.com/splode/go-input-validation-demo/lead 0.011s
```

We also want to ensure that the validation fails if we pass invalid data. In the following test, we'll create a test where we expect validation to fail and to receive an error. We'll omit the "name" field, which is required. When the lead JSON is unmarshaled, the zero-value for the name field will be an empty string.

We expect the Validate method to return an error in this case, so we fail the test if the Validate method _does not_ return an error.

```go
// lead_test.go
func TestLeadNameRequired(t *testing.T) {
  js := `{"email": "joe@example.com", "organization": "Example, Inc.", "message": "I'm interested in learning more about your project.", "phone": "555-555-5555", "newsletter": false}`

  var l lead.Lead
  if err := json.Unmarshal([]byte(js), &l); err != nil {
    t.Errorf("failed to unmarshal lead to JSON: %v", err.Error())
  }
  if err := l.Validate(); err == nil {
    t.Errorf("expected validation error, none received")
  }
}
```

Testing validation failure passes as expected:

```sh
λ go test ./lead -run TestLeadNameRequired
ok      github.com/splode/go-input-validation-demo/lead 0.012s
```

## Injecting Random Test Data

So far, our tests are only working with a single set of static lead inputs. Using a generation library, such as [brianvoe/gofakeit](https://github.com/brianvoe/gofakeit), we can randomize inputs.

### Testing Random Input

Before calling gofakeit, we'll seed it by passing in the current time. Then, we'll replace each field value in our lead string with a template and corresponding generated value. For the name field, we'll use gofakeit's `Phone` method. For the email field, we'll use the `Email` method, and so on. Be sure to check out gofakeit's documentation for a full list of methods.

```go
// lead_test.go
func TestRandomLead(t *testing.T) {
  gofakeit.Seed(time.Now().Unix())
  js := fmt.Sprintf(`{"name": "%s", "email": "%s", "organization": "%s", "message": "%s", "phone": "%s", "newsletter": %t}`, gofakeit.Name(), gofakeit.Email(), gofakeit.Company(), gofakeit.HackerPhrase(), gofakeit.Phone(), gofakeit.Bool())

  var l lead.Lead
  if err := json.Unmarshal([]byte(js), &l); err != nil {
    t.Errorf("failed to unmarshal lead to JSON: %v", err.Error())
  }
  if err := l.Validate(); err != nil {
    t.Errorf("expected validation on %v, got %v", l, err)
  }
}
```

Testing a randomly generated lead passes as expected:

```sh
λ go test ./lead -run TestRandomLead
ok      github.com/splode/go-input-validation-demo/lead 0.010s
```

## Validating Nested Data and Arrays

### Testing Slices

## Custom Validation Rules

### Testing Custom Validation

## Outro

In this exercise, we worked with data. This process can be used to validate
