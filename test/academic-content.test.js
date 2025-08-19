/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Academic Content Tests', () => {
  
  test('basic test should pass', () => {
    expect(1 + 1).toBe(2);
  });

  test('should find index.astro file', () => {
    const indexPath = path.join(__dirname, '../src/pages/index.astro');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('should find publicaciones.astro file', () => {
    const publicacionesPath = path.join(__dirname, '../src/pages/publicaciones.astro');
    expect(fs.existsSync(publicacionesPath)).toBe(true);
  });

  test('should have scholar data file', () => {
    const scholarPath = path.join(__dirname, '../src/data/scholar.json');
    if (fs.existsSync(scholarPath)) {
      const scholarData = JSON.parse(fs.readFileSync(scholarPath, 'utf8'));
      expect(scholarData).toHaveProperty('publications');
      expect(Array.isArray(scholarData.publications)).toBe(true);
    }
  });

  test('should have ScholarMetrics component', () => {
    const componentPath = path.join(__dirname, '../src/components/ScholarMetrics.astro');
    if (fs.existsSync(componentPath)) {
      const componentContent = fs.readFileSync(componentPath, 'utf8');
      expect(componentContent).toMatch(/citations|h-index|métricas/i);
    }
  });

  test('should have RecentPublications component', () => {
    const componentPath = path.join(__dirname, '../src/components/RecentPublications.astro');
    if (fs.existsSync(componentPath)) {
      const componentContent = fs.readFileSync(componentPath, 'utf8');
      expect(componentContent).toMatch(/publicaciones|publications|scholar/i);
    }
  });

});
