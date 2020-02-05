# use-browser

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@awardit/react-use-browser.svg)](https://bundlephobia.com/result?p=@awardit/react-use-browser)
[![Dependencies](https://img.shields.io/david/awardit/react-use-browser.svg)](https://www.npmjs.com/package/@awardit/react-use-browser)
[![Build Status](https://travis-ci.org/awardit/react-use-browser.svg?branch=master)](https://travis-ci.org/awardit/react-use-browser)
[![Codecov](https://img.shields.io/codecov/c/gh/awardit/react-use-browser)](https://codecov.io/gh/awardit/react-use-browser)
![License](https://img.shields.io/npm/l/@awardit/react-use-browser)
[![npm](https://img.shields.io/npm/v/@awardit/react-use-browser)](https://www.npmjs.com/package/@awardit/react-use-browser)
[![Greenkeeper badge](https://badges.greenkeeper.io/awardit/react-use-browser.svg)](https://greenkeeper.io/)

This hook enables client-side hydration of Server-Side-Rendered components
where the final JS-enhanced DOM differs from the server-rendered markup.
It does this by first letting the components render the server markup during
hydration and — once hydrated — swap out the differing parts.

This is useful when you deliberately want to provide a different markup for
clients without JavaScript with an isomorphic application, such as:

 * A native `<input type="select" />` on the server and a custom
   JavaScript-enhanced `<Select />` component on the client.
 * Pagination on the server which gets transformed into an infinite-scroll
   once client JavaScript has loaded.
 * A dynamic navigation which has a static version without JavaScript.
 * Other progressive-enhancements.

## Installation

```bash
npm i -E @awardit/react-use-browser
```

If Webpack is used, ensure that the server- and client-bundles are built to
`node` and `web` targets respectively (or targets which use standard
`module`/`main` only on server, and `browser`/`module`/`main` fields on client).

For Rollup `rollup-plugin-node-resolve` needs to be told to load the main-field
`browser` before `module` or `main` when it is building the browser bundle.

## Usage

```javascript
// app.js

import { useBrowser } from "@awardit/react-use-browser";

export const App = () => {
  const browser = useBrowser();

  if (browser) {
    return <p>This is browser markup</p>;
  }

  return <p>Server markup</p>;
};
```

```javascript
// server.js

import { renderToString } from "react-dom/server";
import { App } from "./app";

res.write(`...
<div id="app">`, "utf-8");
res.write(renderToString(<App />), "utf-8");
res.write(`</div>
...`, "utf-8");
```

```javascript
// client.js

import { hydrate } from "react-dom";
import { markHydrated } from "@awardit/react-use-browser";
import { App } from "./app";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Missing app root");
}

hydrate(<App />, root, markHydrated);
```

## API

### `useBrowser(): boolean`

A hook returning `true` if the component is running in the browser. It will
return `false` on the server and during client-hydration.

After client-hydration it will queue a re-render with the next render returning
`true`.

### `markHydrated(): void`

`markHydrated` should be called once hydration is finished on the client to
flag that any uses of `useHydrate` should start with the client markup
immeidiately.

If this function is not called once hydration is finished on the client then
`useBrowser` will always perform a double-render as if it was hydrating in every
new component using it, first with server-markup and then with client markup.
Using `markHydrated` ensures that the client always renders client-markup
right away from that point on.

This function will throw on the server.

## FAQ

### Why not use a global build variable?

Using a global variable like `__BROWSER__` or `process.env.BROWSER` or similar
will cause the resulting bundles to have differing markup making it impossible
to use `ReactDOM.hydrate()` on the client since the markup differs.

### Why not just use `ReactDOM.render()` on the client?

Using `ReactDOM.render()` to hydrate a server-rendered container is deprecated
and will be removed in React 17.

### Why is differing markup a problem when using `ReactDOM.hydrate()`?

Hydration makes assumptions about the existing markup and will not make many, if
any, modifications to it when starting the application. This will shorten the
time-to-interactive greatly since the application will only have to attach the
required event-handlers and populate internal state.
