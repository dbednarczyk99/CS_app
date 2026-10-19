import React from 'react';
import ReactDOM from 'react-dom/client';
// czcionki strony piekarni – z plików w projekcie (bez pobierania z Google)
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import '@fontsource/oswald/400.css';
import '@fontsource/oswald/500.css';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
