import path from 'path';
import YAML from 'yamljs';

export const __dirname = path.resolve(process.cwd());

export function loadOpenApiYaml(): object {
  const yamlPath = path.resolve(process.cwd(), 'openapi.yml');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const swaggerDocument: object = YAML.load(yamlPath);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return swaggerDocument;
}
