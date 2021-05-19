import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import PrimaryRoutes from "./router/primary.routes";
import './App.scss';

// const logger = require('@azure/logger');
// logger.setLogLevel('info');

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <PrimaryRoutes/>
      </BrowserRouter>
    </div>
  );
}

export default App;
