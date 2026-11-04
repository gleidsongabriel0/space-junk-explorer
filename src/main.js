import { createRoot } from 'react-dom/client';
import { html } from './utils/html.js';
import { App } from './App.js';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(html`<${App} />`);
}
