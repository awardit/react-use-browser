# use-browser

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@crossroads-loyalty-solutions/react-use-browser.svg)](https://bundlephobia.com/result?p=@crossroads-loyalty-solutions/react-use-browser)
[![Dependencies](https://img.shields.io/david/crossroads-loyalty-solutions/react-use-browser.svg)](https://www.npmjs.com/package/@crossroads-loyalty-solutions/react-use-browser)
[![Build Status](https://travis-ci.org/crossroads-loyalty-solutions/react-use-browser.svg?branch=master)](https://travis-ci.org/crossroads-loyalty-solutions/react-use-browser)
[![Codecov](https://img.shields.io/codecov/c/gh/crossroads-loyalty-solutions/react-use-browser)](https://codecov.io/gh/crossroads-loyalty-solutions/react-use-browser)
![License](https://img.shields.io/npm/l/@crossroads-loyalty-solutions/react-use-browser)
[![npm](https://img.shields.io/npm/v/@crossroads-loyalty-solutions/react-use-browser)](https://www.npmjs.com/package/@crossroads-loyalty-solutions/react-use-browser)

A hook enabling client side hydration of Server-Side-Rendered components when
server-produced markup needs to differ from the final client application markup.

This is useful when you deliberately want to render different markup on the
server with the same isomorphic application, such as:

 * Pagination on the server which gets transformed into an infinite-scroll
   once client JavaScript has loaded.
 * A native `<input type="select" />` on the server and a custom
   JavaScript-enhanced `<Select />` component on the client.

This hook solves the issue of ReactDOM `hydrate` having issues with hydrating
progressive-enhancement webapps where the JS-enhanced client DOM differs
from the server-rendered markup. It does this by first letting the components
render the server markup during hydration and — once hydrated — swap out
the differing parts.

## Installation

```bash
npm i -E @crossroads-loyalty-solutions/react-use-browser
```

`rollup-plugin-node-resolve` needs to be told to load the `browser`-main
when it is building the browser bundle:

```javascript
import { resolvePlugin } from "rollup-plugin-node-resolve";

export default [
  {
    input: "src/server.js",
    plugins: [
      // ...
      resolvePlugin({
        preferBuiltins: true,
        mainFields: ["module", "main"],
      }),
      // ...
    ],
  },
  {
    input: "src/client.js",
    plugins: [
      // ...
      resolvePlugin({
        preferBuiltins: false,
        // Note the extra "browser" main-field:
        mainFields: ["browser", "module", "main"],
      }),
      // ...
    ],
  },
];
```

## Usage

```javascript
// app.js

import { useBrowser } from "@crossroads-loyalty-solutions/react-use-browser";

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
import { markHydrated } from "@crossroads-loyalty-solutions/react-use-browser";
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
