import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage.js';
import LoginPage from './LoginPage.js';
import RegistrationPage from './RegistrationPage.js';
import Ecredit from './E_Credit.js';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/ecredit" element={<Ecredit />} />
            </Routes>
        </Router>
    );
};

export default App;
