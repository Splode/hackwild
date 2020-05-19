---
layout: post
title: Accurate JavaScript Timers with Web Workers
description: Increase the accuracy and reliability of JavaScript timing functions, such as setInterval and setTimeout with web workers.
keywords: setinterval, settimeout, javascript, web worker, Christopher Murphy, accurate timer, multi-threading
tags: JavaScript
category: JavaScript
---

Creating timers in JavaScript with `setTimeout` or `setInterval` is a simple and straightforward process. However, the accuracy and reliability of these timers varies. In certain contexts, such as when a browser tab or window loses focus, `setInterval` and `setTimeout` timing can drift, diminishing their accuracy. One reason for this drift is that the JavaScript is executed in a single _main_ thread, which shares CPU cycle time with many other processes.

One way to increase the accuracy of timers created with `setTimeout` and `setInterval` is to execute them in a dedicated thread, separate from the main thread. Most browsers offer a Web Worker API, allowing _worker_ threads to be run in the background.

## The Problem with Timers

Browsers execute JavaScript in a single thread. This _main_ thread is responsible for all sorts of things, including listening and responding to user events, updating the UI, etc. Operations, including timing with `setTimeout` or `setInterval`, share CPU cycles with other tasks in this thread. If the main thread is blocked or throttled, such as when a browser tab loses focus, execution of `setTimeout` and `setInterval` can lag.

For most applications, a `setInterval` or `setTimeout` executed in the _main_ thread will suffice--the potential lag is often small and wouldn't impact the overall experience. But in situations requiring accuracy and reliability, other approaches are required.

### Case Study: Improving Pomodoro Timer Accuracy

I encountered the issue of timer inaccuracy when working on a Pomodoro timer application. Pomodoro is a productivity technique that involves chunking time into segments of focussed effort and unfocussed downtime. I created a Pomodoro timer application, [Pomotroid](https://splode.github.io/pomotroid/), to help track and time these segments. The application is developed with Electron and uses a `Timer` class with `setInterval` under the hood.

I noticed that if the application window was minimized or hidden, the timer would lag behind the system clock. Sometimes this lag was only a few seconds, while at other times it could be up to 10 minutes! The lag effect was compounded by the fact that each new timer depended upon the completion of the previous timer. So, a lag of a few milliseconds could easily compound over time. This posed a serious problem as the application's primary role is to reliably inform users on the timing of their work.

Moving the execution of the `Timer` to a web worker increased the accuracy and reliability. Thanks to a dedicate worker thread, even when the application window is minimized or hidden, the timer maintains accuracy over periods of several hours.

## Timers in Web Workers

The [Web Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) allows you to execute code in a separate thread from the main thread. Web workers have a limited API. For example, you won't have access to the DOM, but you're still able to access things like `setInterval` and `setTimeout`.

Creating a web worker is simple. It involves creating a separate JavaScript file, which will run in the worker. In this file, we'll setup a simple `setTimeout` function that logs some information to the console when it completes.

```js
// timer-worker.js
const start = performance.now()
setTimeout(() => {
  console.log(performance.now() - start)
}, 1000 * 60 * 10)
```

Back in our main script, we'll instantiate a new worker, passing the location of the worker file. We'll also start another timer here for comparison.

```js
// main.js
;(function() {
  const worker = new worker('timer-worker.js')
  const start = performance.now()
  setTimeout(() => {
    console.log(performance.now() - start)
  }, 1000 * 60 * 10)
})()
```

## Main and Worker Thread Comparisons

In order to illustrate the difference between executing timers in the main thread versus web workers, I

## Closing Thoughts

Executing timers in web workers can improve their accuracy, but this approach isn't a silver bullet. There's still no guarantee that `setInterval` and `setTimeout` won't lag. If you need precise calculation between times, you may be better off using [Date objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or the [Performance interface](https://developer.mozilla.org/en-US/docs/Web/API/Performance). Nevertheless, pairing a web worker with `setInterval` and `setTimeout` can increase timer accuracy for lots of scenarios.
