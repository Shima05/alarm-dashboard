import * as OpenApiValidator from 'express-openapi-validator';
import path from 'path';

const spec = path.resolve(process.cwd(), 'openapi.yml');

export const validateInputs = OpenApiValidator.middleware({
  apiSpec: spec,
  validateRequests: true,
  validateResponses: true,
});
