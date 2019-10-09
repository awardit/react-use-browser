/* @flow */

export const markHydrated = (): void => {
  throw new Error("Should only be called on the client");
};

export const useBrowser = (): boolean =>
  // We are never browser
  false;
