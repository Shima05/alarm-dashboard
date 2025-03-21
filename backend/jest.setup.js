jest.mock('express-openapi-validator', () => ({
  middleware: jest.fn(() => (req, res, next) => next()),
}));
