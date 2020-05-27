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

For example, let's say we have a class Timer, which performs some basic timing functions. We want to register a handler that executes when the timer completes. We define a method signature on the Timer that returns a callback.

```ts
// Timer.js
class Timer {
  public onComplete?: () => void

  public start(): void {
    setTimeout(() => {
      if (!this.onComplete) return
      this.onComplete()
    }, 7000)
  }
}

const timer = new Timer()
timer.onComplete = () => {
  console.log('timer completed event')
}
```

- Basic and simple implementation.
- Doesn't need to inherit from a base class.

## Event Listeners

- Allows any number of different listeners per event.
- Allows consumer to add and remove event listeners.

### Custom Events

## Event Emitter

If you're working in a server-side context, such as Node.js, you won't have access to the EventTarget class. Instead, Node.js has its own version, EventEmitter.

Working with the EventEmitter class is like working with EventTarget.

## Closing Thoughts

Each of these event techniques has its pros and cons. Deciding on which one to use will depend on the application requirements.
