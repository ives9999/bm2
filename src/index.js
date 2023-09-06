import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import Team from './Team';

import { BrowserRouter } from "react-router-dom";

// import { MyComponent } from './api/MyComponent';
// import { HomeTeam } from './api/home/team';

//import { useState, useEffect } from "react";

//const [team, setTeam] = useState({id: 0, name: 'name'})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  
    <BrowserRouter>
        <App />
    </BrowserRouter>

  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();


