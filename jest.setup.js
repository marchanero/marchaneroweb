// jest.setup.js
import { TextEncoder, TextDecoder } from 'util';

// Fix para jsdom que no incluye TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Fix para APIs web que podrían faltar en jsdom
if (typeof global.URL === 'undefined') {
  global.URL = URL;
}

// Mock básico para location en jsdom
if (typeof global.location === 'undefined') {
  global.location = {
    hostname: 'localhost',
    href: 'http://localhost',
    origin: 'http://localhost',
    pathname: '/',
    port: '',
    protocol: 'http:',
    search: ''
  };
}