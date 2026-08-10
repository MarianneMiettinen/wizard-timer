import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container === null) {
  throw new Error('No #root element in index.html — nothing to mount into.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
