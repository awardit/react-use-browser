/* @flow */

import { useLayoutEffect, useState } from "react";

let hydrated = false;

export const markHydrated = (): void => {
  hydrated = true;
};

export const useBrowser = (): boolean => {
  // Ensure we start with true if we are hydrated
  const [browser, setBrowser] = useState(hydrated);

  /* eslint-disable react-hooks/exhaustive-deps */
  // We ONLY run this on the client, and only once
  useLayoutEffect(() => {
    if (!browser) {
      setBrowser(true);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return browser;
};
