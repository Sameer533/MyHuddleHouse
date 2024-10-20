import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ServerDashboard from './ServerDashboard';
import CooksDashboard from './CooksDashboard';
import AboutUsDashboard from './AboutUsDashboard';
import OtherRolesDashboard from './OtherRolesDashboard';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ManagerHomepage from './ManagerHomepage';
import UploadManagerDashboard from './UploadManagerDasboard';
import Masti from './Masti';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Router>
      <Routes>
      <Route path="/" element={  <App />
    } />
        <Route path="/server" element={<ServerDashboard />} />
        <Route path="/cooks" element={<CooksDashboard />} />
        <Route path="/other-roles" element={<OtherRolesDashboard />} />
        <Route path="/about-us" element={<AboutUsDashboard/>} />
        <Route path="/Manager-homepage" element={<ManagerHomepage/>} />
        <Route path="/Manager-upload" element={<UploadManagerDashboard/>}/>
        <Route path="/Masti" element={<Masti/>}/>

      </Routes>
    
    </Router>

  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
