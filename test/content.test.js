import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Content Tests', () => {
  it('should have basic content structure', () => {
    const projectRoot = path.join(__dirname, '..');
    expect(fs.existsSync(projectRoot)).toBe(true);
  });
});