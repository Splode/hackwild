---
layout: post
title: Testing and Validating Input in Go
description: Data validation is a defensive strategy, which helps to ensure the data you're working with has the type and structure that you expect.
keywords: go, golang, input, validation, struct, json, development, backend, input validation, data validation, testing, REST
tags: Go
category: Go
hero_image:
  src: '/static/images/hackwild_go-input-validation_hero--825x464.png'
  alt: "Illustration of the phrase 'Validation, testing and validating input in Go'"
og_image: '/static/images/hackwild_go-input-validation_hero--1200x600.png'
date: 2020-06-10T14:50:11-6:00
---

In a perfect world, before client-submitted data ever made its way to a backend application, it is sanitized, valid, pristine. Yet, in my experience, you should not assume the validity of user-submitted data.

You could be working with invalid data for many reasons: Client-side validation might provide a false positive. A bot bypassed submission guards. Someone simply made a mistake.

Regardless of the reasons for receiving invalid data—and even if you are working with valid data—it is still a good idea to validate on the backend. It is a defensive practice that can save time and headaches.

This exercise will explore the process of validating input in Go. We will work with a JSON string, like what is often encountered in a REST API client request. We will define validation rules for different input fields and write tests for different input scenarios.

## Lead Input Struct

We are going to use a common scenario in this exercise: processing a lead form submission from a client. Lead forms are often simple, but because they are open and accessed without authentication, they need thorough validation.

We receive the lead form data as a JSON string, so we create a definition for a Lead struct with corresponding JSON tags for unmarshaling.

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

Once we have our Lead struct in place, we can attempt to validate its fields. To help with validation, we will use the [go-playground/validator](https://github.com/go-playground/validator) package. Used by many projects, including the Gin framework, the `validator` package provides many useful validation functions.

### Validation Tags

The validator package defines validation rules using field tags. We can augment our existing Lead definition to include validation rules. Add validation rules using the `validate` tag and a predefined rule name, such as "required". Additional rules are delimited by commas, and there are some rules, such as "max", which take arguments. For a complete list of predefined validation rules, see the [validator documentation](https://pkg.go.dev/github.com/go-playground/validator?tab=doc).

Using the `validate` tag, we specify the validation rules for each field we want to test. Validator ignores fields without validate tags.

- Name: the name field is required and should only consist of ASCII characters. It is limited to 128 characters.
- Email: the email field is required and should be a valid email format. It is limited to 128 characters.
- Organization: the organization field is _optional_ and limited to 128 characters.
- Message: the message field is _optional_ and limited to 512 characters.

> Note: in reality, you may want to allow for more than ASCII characters in a name field, especially if names like 'X Æ A-12' increase in popularity. For demonstration, we're going to limit the character type.

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

Validating a struct involves passing the struct to the `validate.Struct` method. We want the lead package to handle its validation, so we add a `Validate` method that wraps the validation. This way, we can call the Validate method on an instance of lead without having to manage the validator package or pass any arguments.

We define a package-level variable `validate` to hold an instance of the validator. In the package `init` function, we construct a new instance of `validator`.

The Validate method takes no arguments and returns a single error or `nil`. Within Validate, we call the `Struct` method on the `validate` instance, passing in the lead instance. If the validation fails, this method returns an error. We need to check the error type to ensure that it is a validation error and not _a failure to validate_. This can happen, for example, if we use an undefined validation tag in the lead definition.

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

We also want to ensure that the validation fails if we pass invalid data. In the following test, we expect validation to fail and to receive an error. We omit the required "name" field. When unmarshaled, the name field will have the zero-value for its type--an empty string.

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

So far, our tests are only working with a single set of static lead inputs. Using a generation library, such as [brianvoe/gofakeit](https://github.com/brianvoe/gofakeit), we can randomize input data.

### Testing Random Input

Before calling gofakeit, we'll seed it by passing in the current time. Then, we'll replace each field value in our lead string with a template and corresponding generated value. For the name field, we'll use gofakeit's `Name` method, which returns a random name as a string. For the email field, we'll use the `Email` method, and so on. Be sure to check out gofakeit's documentation for a full list of methods.

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

Testing a random lead passes as expected:

```sh
λ go test ./lead -run TestRandomLead
ok      github.com/splode/go-input-validation-demo/lead 0.010s
```

## Validating Nested Data and Arrays

The "products" field of the lead corresponds with a `<select>` form input. A user would be able to select many options from a predefined list, such as "cloud storage" or "cloud functions". The JSON representation of this is an array of strings. Our validation needs to assert that the values in the "products" array fall within a predefined list.

In the Lead definition, we'll add a "dive" rule to the validate tag. The "dive" rule instructs validator to inspect values within a collection, such as a slice. With the "oneof" rule, we state that the following strings are acceptable values.

```go
// lead.go
Products []string `json:"products" validate:"dive,oneof='cloud storage' 'cloud functions'"`
```

We can test this validation by creating a new test with a list of products.

```go
// lead_test.go
func TestLeadProducts(t *testing.T) {
  gofakeit.Seed(time.Now().Unix())
  js := fmt.Sprintf(`{"name": "%s", "email": "%s", "organization": "%s", "message": "%s", "phone": "%s", "newsletter": %t, "products": ["cloud storage", "cloud functions"]}`, gofakeit.Name(), gofakeit.Email(), gofakeit.Company(), gofakeit.HackerPhrase(), gofakeit.Phone(), gofakeit.Bool())

  var l lead.Lead
  if err := json.Unmarshal([]byte(js), &l); err != nil {
    t.Errorf("failed to unmarshal lead to JSON: %v", err.Error())
  }
  if err := l.Validate(); err != nil {
    t.Errorf("expected validation on %v, got %v", l, err)
  }
}
```

Testing the validity of the products array passes as expected:

```sh
λ go test ./lead -run TestLeadProducts
ok      github.com/splode/go-input-validation-demo/lead 0.011s
```

## Custom Validation Rules

Validator doesn’t include rules for validating phone numbers. This makes sense if you consider the variation in phone number formatting around the world. Luckily, Google has open-sourced their [libphonenumber library](https://github.com/google/libphonenumber) for parsing, formatting, and validating international phone numbers. We are going to use a Go port of this library, [nyaruka/phonenumbers](https://github.com/nyaruka/phonenumbers), to help parse and validate phone number inputs.

To validate phone numbers, we need to create a custom validation function for use with the validator package. Creating a custom validator function involves defining a handler function and registering it with the validator. The validation function gets the tested field as an argument and should return a boolean value. Within the handler function, we can test the field against our own validation rules.

Using the `phonenumbers` package, we'll first parse the value of the field with the "US" as the default region. If parsing fails, our validation also fails and we return false. If parsing succeeds, we return the value of the `IsPossibleNumber` method, which returns true if the phone number is _likely_ valid. For stricter validation, use the `IsValidNumber` method.

```go
// lead.go
func validatePhone(fl validator.FieldLevel) bool {
  p, err := phonenumbers.Parse(fl.Field().String(), "US")
  if err != nil {
    return false
  }
  return phonenumbers.IsPossibleNumber(p)
}
```

With our custom validation function defined, we can register it with the validator by calling the `RegisterValidation`, passing the rule name and the handler function.

```go
// lead.go
func init() {
  validate = validator.New()
  if err := validate.RegisterValidation("phone", validatePhone); err != nil {
    fmt.Printf("unable to register custom validator: %s\n", err.Error())
  }
}
```

Last, we can update our lead definition to include our custom validation tag.

```go
// lead.go
Phone string `json:"phone" validate:"phone"`
```

### Testing Custom Validation

Re-running our `TestRandomLead` test, which already uses a random phone number, illustrates that our validation passes as expected.

To be sure our custom validation is working as intended, we can create a new test with an invalid phone number. In this test, we expect validation to fail.

```go
func TestPhoneInvalid(t *testing.T) {
  js := `{"name": "", "email": "joe@example.com", "organization": "Example, Inc.", "message": "I'm interested in learning more about your project.", "phone": "5", "newsletter": false}`

  var l lead.Lead
  if err := json.Unmarshal([]byte(js), &l); err != nil {
    t.Errorf("failed to unmarshal lead to JSON: %v", err.Error())
  }
  if err := l.Validate(); err == nil {
    t.Errorf("expected validation error, none received")
  }
}
```

Testing the failed validation in our custom function passes as expected:

```sh
λ go test ./lead -run TestPhoneInvalid
ok      github.com/splode/go-input-validation-demo/lead 0.011s
```

## Conclusion

In this exercise, we validated and tested input data for a lead form. Validation tests helped to ensure our validation rules worked as expected. We used a library to generate random data, enhancing the robustness of our tests. We created a validation function to handle custom validation rules.

This process can be used to validate and test many types of data, as well. Maybe you are working with complex mapping or a public health datasets.

Validating data, even if you are confident the data is in good shape, is a smart and defensive strategy. It increases the chances the data you are working with has the type and structure that you expect.

The [repo for this exercise](https://github.com/splode/go-input-validation-demo) is available on GitHub.
