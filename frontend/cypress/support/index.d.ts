export {};

declare global {
  interface Window {
    Cypress?: object;
    store?: any;
  }
}
