const mockDb = {
  all: jest.fn((query, params, callback) => {
    if (typeof callback === 'function') {
      callback(null, []);
    }
  }),
  run: jest.fn((query, params, callback) => {
    if (typeof callback === 'function') {
      callback(null);
    }
  }),
  serialize: jest.fn((callback) => {
    if (typeof callback === 'function') {
      callback();
    }
  }),
};

export default mockDb;
