import { BrowserRouter } from 'react-router-dom';
import React from 'react';

import PrimaryRoutes from "./router/primary.routes";
import './App.scss';


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
