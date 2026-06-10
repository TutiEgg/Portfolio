import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom ships without IntersectionObserver; provide a minimal stub so that
// components relying on it (Timeline, TimelineItem via framer-motion) don't crash.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverStub {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  globalThis.IntersectionObserver = IntersectionObserverStub;
  window.IntersectionObserver = IntersectionObserverStub;
}

// matchMedia is used by some animation primitives; default to a sensible mock.
if (typeof window.matchMedia === 'undefined') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// scrollIntoView is not implemented in jsdom.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

afterEach(() => {
  cleanup();
});
