---
layout: post
title: Event Creation and Handling Techniques in JavaScript and TypeScript
description: Exploring event handling and creating methods in JavaScript and TypeScript
keywords: javascript, typescript, events, event handling, event emitter, event property, eventemitter, eventtarget, custom event
tags: TypeScript
category: TypeScript
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

Event property handlers are a dead-simple way to create and handle events, but it does have a caveat. Attempting to define more than one handler will overwrite already-defined handlers. For example, in the following example, the first handler will be overwritten by the second.

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

To remove an event handler, delete the property.

```ts
// consumer.ts
delete t.onComplete
```

## Event Listeners

- Allows any number of different listeners per event.
- Allows consumer to add and remove event listeners.

### Custom Events

## Event Emitter

If you're working in a server-side context, such as Node.js, you won't have access to the EventTarget class. Instead, Node.js has its own version, EventEmitter.

Working with the EventEmitter class is like working with EventTarget.

## Closing Thoughts

Each of these event techniques has its pros and cons. Deciding on which one to use will depend on the application requirements.

### Event Property Handler

- Basic and simple implementation.
- Doesn't need to inherit from a base class.
- Limited to one handler per event.

### EventTarget and EventEmitter

- Allows any number of handler per event.
- Require inheriting from base event classes.
