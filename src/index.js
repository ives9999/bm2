import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import Header from './Header';
import Home from './Home';
import Footer from './Footer';

// import { MyComponent } from './api/MyComponent';
// import { HomeTeam } from './api/home/team';

//import { useState, useEffect } from "react";

//const [team, setTeam] = useState({id: 0, name: 'name'})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  
    <Header />
     <Home />
    <Footer />

  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();


