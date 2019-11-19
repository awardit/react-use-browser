/* @flow */

import test from "ava";
import { markHydrated, useBrowser } from "../src";

test("markHydrated throws", t => {
  t.throws(() => markHydrated(), { message: "Should only be called on the client" });
});

test("useBrowser is always false", t => {
  t.is(useBrowser(), false);
  t.is(useBrowser(), false);
});
