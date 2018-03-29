---
layout: post
title: Live Image Previews for File Uploads using FileReader
description: >
  Create live image previews for file uploads using the built-in FileReader object and vanilla JavaScript.
tags: JavaScript
category: JavaScript
---

By default, when a file is uploaded using the file input form element its path is stored as a string. It's

To do this, we'll make use of the `FileReader` object, which is part of the [File API](https://www.w3.org/TR/FileAPI/).

## Basic Setup

### Input and Image Elements

Our basic structure will be an image container with an empty `<img>` element and an `<input>` element with a type of `file`. To limit the file uploads to common image MIME types, we can use the `accept` attribute on the `<input>` element and pass in a list of acceptable file extensions. Lastly, we'll attach data attributes for JavaScript DOM targeting and a class for our image container.

```html
<div class="Preview-img">
  <img data-id="filePreview">
</div>
<input type="file" accept=".jpg, .jpeg, .png, .gif" data-id="fileInput">
```

### Providing a few Basic Display Constraints with CSS

To ensure that our images fit within the confines of our layout, we'll use the `object-fit` property and set it to `cover`. This will crop all images to fit within its parent container, regardless of size or aspect ratio.

```SCSS
.Preview-img {
  background-color: gainsboro;
  margin-bottom: 1rem;
  width: 300px;
  height: 200px;
  & img {
    object-fit: cover;
    object-position: center;
    width: 100%;
    height: 100%;
  }
}
```

### Accessing the Elements in JavaScript

To handle when a user selects an image for upload, we'll attach an event listener to the `<input>` element with the `'change'` event. When a user selects a file, a reference to that file will be added to the `files` array on the `input` object. Each file element in this array holds information on the file, including filesize, MIME type, date modified, etc.

For now, we'll log the files attached to the input element.

```js
const filePreview = document.querySelector('img[data-id=filePreview]')
const fileInput = document.querySelector('input[data-id=fileInput]')

fileInput.addEventListener('change', handleFileUpload, false)

function handleFileUpload (inputEvent) {
  const input = inputEvent.target
  console.log(input.files[0])
}
```

## Using the FileReader Object

If we take a look at the log output after choosing an image file at this point, we'll see that `this.files` contains a `FileList` object with an array of `File` objects (in this case, we'll only have 1 `File`). To read the data that the `File` represents and serve a preview of it, we'll need to use the `FileReader` object.

### Loading the Image Preview

The `FileReader` constructor returns a new `FileReader` object, which has several useful methods and events for handling file data.

```js
function handleFileUpload (inputEvent) {
  const input = inputEvent.target
  const reader = new FileReader()

  reader.onload = readerEvent => {
    filePreview.src = readerEvent.target.result
  }
  reader.readAsDataURL(input.files[0])
}
```

> Note that we're dealing with two different events here: the first event is the `<input>` 'change' event, while the second is the `FileReader` 'load' event.

### Image Type Validation

Setting the `accept` attribute on the file `<input>` element will limit the types of files that users can choose, but there are ways to circumvent this restriction. If the uploaded files are going to be sent to a database, we want to ensure that we are sending the right file type. To provide a second level of validation we can perform a MIME type check at the time the file is handled.

The `File` object attached to the `<input>` element has a `type` property with a `String` value corresponding to the file's MIME type. When we handle the file, we can check this property against a list of valid MIME types and only continue processing the file if is in an accepted format. To do this, we'll define an array of MIME type strings and check if the `type` value matches an array element.

```js
```

## Wrapping Up

The File API
