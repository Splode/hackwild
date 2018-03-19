---
layout: post
title: "Independently Styling Underline Color"
tagline: "A CSS snippet for independently styling text and underline color."
date: 2017-04-01
author: Christopher Murphy
description: A CSS snippet for independently styling text and underline color.
excerpt: If you've ever wanted to set the color of the underline for underlined text separately from the text color, you may have come across the CSS property `text-decoration-color`. Unfortunately, this property is not yet fully supported by all browser vendors.
categories: CSS snippet typography
tags: CSS
---
# Underlining Text
## Styling Underline Color
If you've ever wanted to set the color of the underline for underlined text separately from the text color, you may have come across the CSS property `text-decoration-color`. Unfortunately, this property is not yet fully supported by all browser vendors. At the time of this article being written, only Chrome and Opera fully support the property<sup>[1][1]</sup>. Fortunately, there's a quick and easy work-around that involves wrapping the underlined content in a `span`.

Here's a simple snippet for independently styling text and underline color. Note that the color property of the `span` element controls the color of the text — in this case the `h1` element — while the `h1` element's `color` property styles the underline color.

{% highlight html %}
<h1><span>Different colored text and underlining</span></h1>
{% endhighlight %}

{% highlight scss %}
h1 {
  color: #F02A71; // underline color
  font-size: 52px;
  margin-bottom: 4em;
  text-decoration: underline;

  span {
    color: #14103B; // text color
  }
}
{% endhighlight %}

I'll add some additional styles to help style our overall document, but this is ancillary.

```scss
// main.scss
@import url(https://fonts.googleapis.com/css?family=Fjalla+One);

body {
  align-items: center;
  background-color: #F9F8ED;
  display: flex;
  font-family: 'Fjalla One', sans-serif;
  height: 100vh;
  justify-content: center;
  text-align: center;
  text-transform: uppercase;
}
```

## See it in Action
## Styling Underline Color
If you've ever wanted to set the color of the underline for underlined text separately from the text color, you may have come across the CSS property `text-decoration-color`. Unfortunately, this property is not yet fully supported by all browser vendors. At the time of this article being written, only Chrome and Opera fully support the property<sup>[1][1]</sup>. Fortunately, there's a quick and easy work-around that involves wrapping the underlined content in a `span`.

Here's a simple snippet for independently styling text and underline color. Note that the color property of the `span` element controls the color of the text — in this case the `h1` element — while the `h1` element's `color` property styles the underline color.

{% highlight html %}
<h1><span>Different colored text and underlining</span></h1>
{% endhighlight %}

{% highlight scss %}
h1 {
  color: #F02A71; // underline color
  font-size: 52px;
  margin-bottom: 4em;
  text-decoration: underline;

  span {
    color: #14103B; // text color
  }
}
{% endhighlight %}

I'll add some additional styles to help style our overall document, but this is ancillary.

```scss
@import url(https://fonts.googleapis.com/css?family=Fjalla+One);

body {
  align-items: center;
  background-color: #F9F8ED;
  display: flex;
  font-family: 'Fjalla One', sans-serif;
  height: 100vh;
  justify-content: center;
  text-align: center;
  text-transform: uppercase;
}
```

## See it in Action

<!-- <p data-height="495" data-theme-id="0" data-slug-hash="mVrVMR" data-default-tab="result" data-user="Splode" data-embed-version="2" data-pen-title="Different Color Underlined Text" class="codepen">See the Pen <a href="http://codepen.io/Splode/pen/mVrVMR/">Different Color Underlined Text</a> by Christopher Murphy (<a href="http://codepen.io/Splode">@Splode</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script> -->

[1]: http://caniuse.com/#search=text-decoration-color "caniuse.com - text-decoration-color"
