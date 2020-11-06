import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from "redux";

import App from "./Components/App";
import "./Style/style.css";


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);