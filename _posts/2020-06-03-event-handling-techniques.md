---
layout: post
title: Event Creation and Handling Techniques in TypeScript
description: Events provide a channel of communication between different parts of an application. There are several techniques for creating and handling events, each with its own advantages and disadvantages.
keywords: javascript, typescript, events, event handling, event emitter, event property, eventemitter, eventtarget, custom event
tags: TypeScript
category: TypeScript
hero_image:
  src: 'hackwild_event-techniques--825x464.jpg'
  alt: "Illustration of the word 'Events'"
og_image: '/static/images/hackwild_event-techniques--1200x600.jpg'
---

A common problem you'll run into when writing software is communication between components. Something happens in some component over here and I want to notify some component over there. Furthermore, I want to reduce coupling between components to increase maintainability. We can solve this problem with events.

Events provide a channel of communication between different parts of an application. Event _emitters_ act as broadcasters, emitting events at specified points. Event _consumers_ listen for those events and do something in response. Emitters don't need to know ahead of time what will consume, or handle its events. This increases flexibility and decoupling.

We'll look at some techniques for creating events and event handlers in JavaScript. I'm going to use TypeScript because it reveals some information about the types we'll use. But these techniques apply to vanilla JavaScript as well.

## Event Property Handlers

A simple technique for event creation and handling is the _event property handler_. Event property handlers allow consumers to define a method called during an event.

For example, let's say we have a class Timer, which performs some basic timing functions. We want to register a handler that executes when the timer completes. First, we define a property signature, `onComplete` on the Timer that returns a callback. This will be an optional property so that we don't call empty handlers.

Next, we'll define a `start` method that starts a timeout. After the timeout completes, we want to fire our onComplete event. We check to see if the handler has a definition and if it does, we call it.

```ts
// Timer.ts
export default class Timer {
  public onComplete?: () => void

  public start(): void {
    setTimeout(() => {
      if (!this.onComplete) return
      this.onComplete()
    }, 7000)
  }
}
```

Now, in some other part of our application, we can instantiate the Timer and register a handler for the complete event. We do this by assigning a handler function to the `onComplete` property of the Timer instance. It's as simple as that.

```ts
// consumer.ts
import Timer from './Timer'

const t = new Timer()
t.onComplete = () => {
  console.log('timer completed event')
  // do some stuff
}
t.start()
```

### Handler Limitations

Event property handlers are a simple way to create and handle events, but it does have a caveat. Attempting to define additional handlers will overwrite existing handlers. For example, in the following example, the second handler overwrites the first.

```ts
// consumer.ts
t.onComplete = () => {
  console.log('first handler definition')
  // this won't execute
}
t.onComplete = () => {
  console.log('second handler definition')
  // this will execute
}
```

### Passing Event Data

To expose some data in the event handler, adjust the property signature with the expected argument type. Then when calling the method, pass in the data. In this example, the event callback exposes the time of the event firing. The consumer can use or ignore it.

```ts
// Timer.ts
export default class Timer {
  public onComplete?: (time: number) => void

  public start(): void {
    setTimeout(() => {
      if (!this.onComplete) return
      this.onComplete(Date.now())
    }, 7000)
  }
}
```

```ts
// consumer.ts
t.onComplete = (time: number) => {
  console.log(time)
  // access event data
}
t.onComplete = () => {
  console.log('no data')
  // the data argument is optional
}
```

### Removing an Event Handler

To remove an event handler, delete the property.

```ts
// consumer.ts
delete t.onComplete
```

## Event Listeners with EventTarget

You may be familiar with DOM element event listeners. For example, you may recognize the following bit of code, which attaches an event handler to a button when clicked:

```js
const btn = document
  .getElementById('some-btn')
  .addEventListener('click', () => {
    // do some stuff
  })
```

This pattern is available to DOM elements that implement the [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) interface. The easiest way to gain access to this interface is through inheritance or composition. In this example, we'll look at inheritance.

Using ES6 classes, we can have our `Timer` class implement this interface by extending the `EventTarget` class. Note that because our class extends the `EventTarget` class, we need to call `super()` in the constructor.

We'll define the `'complete'` event as a property. EventTarget works with the `Event` interface, so we'll initialize it as a new Event, passing in the event name.

In the start method after the timeout completes, we'll fire the 'complete' event using the `dispatchEvent` method, passing in the `_complete` property. The `dispatchEvent` method is available on the `EventTarget` class and takes a single `Event` argument.

```ts
// Timer.ts
export default class Timer extends EventTarget {
  constructor() {
    super()
  }

  private _complete: Event = new Event('complete')

  public start(): void {
    setTimeout(() => {
      this.dispatchEvent(this._complete)
    }, 7000)
  }
}
```

With our event emitter in place, we can instantiate the Timer and register a handler for the complete event using the `addEventListener` method. The `completeHandler` method fires when the `'complete'` event fires.

```ts
// consumer.ts
import Timer from './Timer'

const t = new Timer()
const completeHandler = () => {
  console.log('timer completed event')
  // do some stuff
}
t.addEventListener('complete', completeHandler)
t.start()
```

Unlike event property handlers, you can attach many event handlers to a single event.

```ts
// consumer.ts
import Timer from './Timer'

const t = new Timer()
const handlerOne = () => {
  console.log('first handler definition')
  // this will execute, too
}
const handlerTwo = () => {
  console.log('second handler definition')
  // this will execute
}
t.addEventListener('complete', handlerOne)
t.addEventListener('complete', handlerTwo)
t.start()
```

### Custom Events

Passing data in events in this method involves using `CustomEvent` in place of the `Event` interface. Back in the Timer class, let's add a new event that exposes some event data.

The `CustomEvent` constructor takes an optional 'detail' argument. We can use the 'detail' object to hold any data we want available on the event.

Instead of declaring and initializing the event at construction, we'll create it at the time the event fires. This is useful if we want to pass time-sensitive data, such as a timestamp.

> Note: the Event and CustomEvent interfaces include a timestamp property. We're creating a timestamp in the CustomEvent as a demonstration of time-sensitive event data.

```ts
// Timer.ts
export default class Timer extends EventTarget {
  constructor() {
    super()
  }

  public start(): void {
    setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent('complete', { detail: { time: Date.now() } })
      )
    }, 7000)
  }
}
```

In the event handler, we now have access to the detail object on the event.

```ts
// consumer.ts
import Timer from './Timer'

const t = new Timer()
const completeHandler = (e: CustomEvent) => {
  console.log('timer completed event', e.detail.time)
}
t.addEventListener('complete', completeHandler)
t.start()
```

### Removing Event Handlers

You can remove an event handler with the `removeEventListener` method.

```ts
// consumer.ts
t.removeEventListener('complete', completeHandler)
```

## Event Listeners with EventEmitter

If you're working in a server-side context, such as with Node.js, you won't have access to the EventTarget class. Instead, Node.js has its own version, [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

Working with the EventEmitter class is like working with EventTarget. Instead of extending EventTarget, our class will extend `EventEmitter`. Events fire with the `emit` method, which takes the event name as a string. You can pass any number of optional arguments in as event data.

```ts
// Timer.ts
import { EventEmitter } from 'events'
import { setTimeout } from 'timers'

export default class Timer extends EventEmitter {
  constructor() {
    super()
  }

  public start(): void {
    setTimeout(() => {
      this.emit('complete', { time: Date.now() })
    }, 7000)
  }
}
```

```ts
// consumer.ts
import Timer from './Timer'

const t = new Timer()
t.on('complete', () => {
  console.log('timer completed event')
})
t.start()
```

## Which to Use

So, which event technique should you use? Each technique has its pros and cons. Deciding on which one to use will depend on the application requirements. Do you need a simple and lightweight approach? Use event property handlers? Do you need to register many handlers per event? Use the EventTarget or EventEmitter interface.

To recap, here are some pros and cons to each approach:

### Event Property Handler

- Basic and simple implementation.
- Doesn't need to inherit from a base class.
- Limited to one handler per event.

### EventTarget and EventEmitter

- Allows any number of handlers per event.
- Must inherit from base event classes.
- Allows consumer to add and remove event listeners.
