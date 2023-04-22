import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

export const mount = () => {
  const id = 'app';

  const rootContainer =
    document.getElementById(id) ||
    document.body.appendChild(
      Object.assign(document.createElement('div'), { id })
    );

  createRoot(rootContainer).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};
