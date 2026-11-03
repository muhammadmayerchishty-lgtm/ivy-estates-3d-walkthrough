import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign WebRTC / Daily.co meeting ejection logs when Vapi voice call concludes
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const msg = args
      .map((a) => (typeof a === 'string' ? a : a?.message || JSON.stringify(a || '')))
      .join(' ');
    if (
      msg.includes('Meeting ended due to ejection') ||
      msg.includes('Meeting has ended') ||
      msg.includes('ejection: Meeting has ended')
    ) {
      console.warn('Daily/Vapi WebRTC session ended cleanly:', ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.includes('Meeting ended due to ejection') ||
      msg.includes('Meeting has ended')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg =
      typeof reason === 'string'
        ? reason
        : reason?.message || JSON.stringify(reason || '');
    if (
      msg.includes('Meeting ended due to ejection') ||
      msg.includes('Meeting has ended')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
