import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DNADashboard from './components/DNADashboard';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <DNADashboard />
  </StrictMode>,
);
