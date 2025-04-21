import '@testing-library/jest-native/extend-expect';
// Polyfill for setImmediate to prevent Jest crashes
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));
