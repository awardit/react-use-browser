/* @flow */

import ava from "ava";
import ninos from "ninos";
import { cleanup, render } from "@testing-library/react";
import { JSDOM } from "jsdom";
import React from "react";

// We need to make sure we cleanup after each test, so serial
const test = ninos(ava).serial;

let browser = require("../src/browser.js");

function init() {
  cleanup();

  const { window } = new JSDOM(`<!doctype html><html><body></body></html>`);

  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: "node.js",
  };

  global.requestAnimationFrame = cb => setTimeout(cb, 0);
  global.cancelAnimationFrame = cb => clearTimeout(cb);

  // Reload the browser module between tests to reset the hydrated flag
  delete require.cache[require.resolve("../src/browser.js")];

  browser = require("../src/browser.js");
}

test.beforeEach(init);
test.afterEach.always(cleanup);

test("useBrowser() is false on first render unless markHydrated has been run", t => {
  const observer = t.context.stub();

  const C = () => {
    const b = browser.useBrowser();

    observer(b);

    return b ? <p>browser</p> : <p>server</p>;
  };

  const { container, rerender } = render(<C />);

  t.is(container.outerHTML, `<div><p>browser</p></div>`);
  t.deepEqual(observer.calls.map(x => x.arguments), [
    [false],
    [true],
  ]);

  rerender(<C />);

  t.is(container.outerHTML, `<div><p>browser</p></div>`);
  t.deepEqual(observer.calls.map(x => x.arguments), [
    [false],
    [true],
    [true],
  ]);

  rerender(<C key="b" />);

  t.is(container.outerHTML, `<div><p>browser</p></div>`);
  t.deepEqual(observer.calls.map(x => x.arguments), [
    [false],
    [true],
    [true],
    [false],
    [true],
  ]);

  browser.markHydrated();

  rerender(<C key="c" />);

  t.is(container.outerHTML, `<div><p>browser</p></div>`);
  t.deepEqual(observer.calls.map(x => x.arguments), [
    [false],
    [true],
    [true],
    [false],
    [true],
    [true],
  ]);
});

test("reset useBrowser() global initial state", t => {
  const observer = t.context.stub();

  const C = () => {
    const b = browser.useBrowser();

    observer(b);

    return b ? <p>browser</p> : <p>server</p>;
  };

  const { container } = render(<C />);

  t.is(container.outerHTML, `<div><p>browser</p></div>`);
  t.deepEqual(observer.calls.map(x => x.arguments), [
    [false],
    [true],
  ]);
});

test("useBrowser() is always true after markHydrated", t => {
  const observer = t.context.stub();

  const C = () => {
    const b = browser.useBrowser();

    observer(b);

    return b ? <p>browser</p> : <p>server</p>;
  };

  browser.markHydrated();

  const { container, rerender } = render(<C />);

  t.is(container.outerHTML, `<div><p>browser</p></div>`);
  t.deepEqual(observer.calls.map(x => x.arguments), [
    [true],
  ]);

  rerender(<C />);

  t.is(container.outerHTML, `<div><p>browser</p></div>`);
  t.deepEqual(observer.calls.map(x => x.arguments), [
    [true],
    [true],
  ]);
});
