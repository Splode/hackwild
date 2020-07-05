---
layout: post
title: More Accurate JavaScript Timers with Web Workers
description: Increase the accuracy and reliability of JavaScript timing functions, such as setInterval and setTimeout with web workers.
keywords: setinterval, settimeout, javascript, web worker, Christopher Murphy, accurate timer, thread, reliability
tags: JavaScript
category: JavaScript
hero_image:
  src: '/static/images/hackwild_web-worker-timer.svg'
  alt: "Illustration of a stopwatch with the phrase 'Web Worker Timers'"
og_image: '/static/images/hackwild_web-worker-timer--1200x600.jpg'
---

Creating timers in JavaScript with `setTimeout` or `setInterval` is a simple and straightforward process. Yet, the accuracy and reliability of these timers vary. In certain contexts, as when a browser tab or window loses focus, `setInterval` and `setTimeout` timing can drift, diminishing their accuracy. One reason for this drift is that the JavaScript executes in a single _main_ thread, which shares CPU cycle time with many other processes.

A technique for increasing the accuracy of `setTimeout` and `setInterval` is executing them in a dedicated thread, separate from the main thread. Most browsers offer a Web Worker API, allowing _worker_ threads to run in the background.

## The Problem with Timers

Browsers execute JavaScript in a single thread. This thread has many responsibilities, including listening and responding to user events, updating the UI, etc. Operations, including timing with `setTimeout` or `setInterval`, share CPU cycles with other tasks in this thread. If the main thread gets blocked or throttled, as when a browser tab loses focus, execution of `setTimeout` and `setInterval` can lag.

For most applications, a `setInterval` or `setTimeout` executed in the _main_ thread will suffice--the potential lag is often small and wouldn't impact the experience. Yet, some scenarios need greater reliability and accuracy.

### Case Study: Improving Pomodoro Timer Accuracy

I encountered the issue of timer inaccuracy when working on a Pomodoro timer application. Pomodoro is a productivity technique that involves chunking time into segments of focused effort and unfocused downtime. I created a Pomodoro timer application, [Pomotroid](https://splode.github.io/pomotroid/), to help track and time these segments. Developed with Electron, it uses a `Timer` class powered by `setInterval`.

I noticed that when minimized or hidden, the application timer would lag behind the system clock. Sometimes this lag was only a few seconds, while at other times it could be up to 10 minutes! When a timer completed, it would kick off a new timer. So, a lag of a few milliseconds compounded over time, producing an inconsistent experience. This posed a serious problem as the application’s primary role is to help users keep track of their time.

Moving the execution of the `Timer` to a web worker increased its accuracy and reliability. Thanks to a dedicated worker thread, even when minimized or hidden, the timer maintains accuracy over periods of several hours.

## Timers in Web Workers

The [Web Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) allows code execution in a thread separate from the main thread. Web workers have a limited set of APIs they can access. For example, you won't have access to the DOM, but you're still able to access things like `setInterval` and `setTimeout`.

Using web workers is simple. It involves creating a separate JavaScript file, whose contents run in the worker. Following is a simple example of a timer in a web worker.

First, we need a file with some code to run in the worker. In this file, we'll set up a simple `setTimeout` function that logs the difference between the starting and ending times.

```js
// timer-worker.js
const start = performance.now()
setTimeout(() => {
  console.log(performance.now() - start)
}, 1000 * 60 * 10) // 10 minutes
```

We'll create another file to serve as our entry point. In this file, we'll instantiate a new worker, passing the location of the worker file. We'll also start another timer here for comparison. Now, when this script loads, a new worker will spawn and its code executed. The worker thread will continue running, even when the tab loses focus or the main thread slows.

```js
// main.js
;(function() {
  const worker = new worker('timer-worker.js')
  const start = performance.now()
  setTimeout(() => {
    console.log(performance.now() - start)
  }, 1000 * 60 * 10) // 10 minutes
})()
```

## Main and Worker Thread Comparisons

We can build on the previous example to illustrate the difference between running a timer on the main thread and in a worker.

The following table represents the results when the browser tab **has focus** (little to no throttling).

| Thread | Time (ms) | Delta Time (ms)      | Lag (ms) |
| ------ | --------- | -------------------- | -------- |
| Main   | `600000`  | `600001.5600000042`  | `1.56`   |
| Worker | `600000`  | `600000.6300000241`  | `0.63`   |
| Main   | `900000`  | `900001.4249999658`  | `1.42`   |
| Worker | `900000`  | `900000.6799999974`  | `0.68`   |
| Main   | `1800000` | `1800001.0650000186` | `1.07`   |
| Worker | `1800000` | `1800000.5450000172` | `0.55`   |
| Main   | `3600000` | `3600001.489999995`  | `1.49`   |
| Worker | `3600000` | `3600000.2250000252` | `0.23`   |

The following table represents the results when the browser tab **does not** have focus (throttling of the main thread).

| Thread | Time (ms) | Delta Time (ms)      | Lag (ms) |
| ------ | --------- | -------------------- | -------- |
| Main   | `600000`  | `600511.5100000112`  | `511.51` |
| Worker | `600000`  | `600001.0100000072`  | `1.01`   |
| Main   | `900000`  | `900412.8750000091`  | `412.88` |
| Worker | `900000`  | `900001.1800000211`  | `1.18`   |
| Main   | `1800000` | `1800897.6649999968` | `897.66` |
| Worker | `1800000` | `1800001.2699999788` | `1.27`   |
| Main   | `3600000` | `3600403.105000034`  | `403.11` |
| Worker | `3600000` | `3600002.4100000155` | `2.41`   |

The results from these tests suggest a notable difference between the two approaches. When a tab is active and the main thread isn't throttled, both the main thread and worker timers have a negligible delay. But when a tab loses focus and the main thread slows, the worker timer outperforms the main thread timer.

The source for this demo is [available on GitHub](https://github.com/splode/worker-timer-demo).

## Closing Thoughts

Executing timers in web workers can improve their accuracy, but this approach isn't a silver bullet. There's still no guarantee that `setInterval` and `setTimeout` won't lag. If you need precise calculation between times, you may be better off using [Date objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or the [Performance interface](https://developer.mozilla.org/en-US/docs/Web/API/Performance). But for most cases, pairing a web worker with `setInterval` and `setTimeout` can increase the reliability and accuracy of timers.
