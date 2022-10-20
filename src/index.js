import React from 'react';
import { createRoot } from 'react-dom/client';
import './scss/index.scss';
import Component from './Component/Component';

createRoot(document.querySelector('.root')).render(
  <React.StrictMode>
  <Component />
  </React.StrictMode>
);
