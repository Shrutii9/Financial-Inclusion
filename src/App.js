import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage.js';
import LoginPage from './LoginPage.js';
import RegistrationPage from './RegistrationPage.js';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
            </Routes>
        </Router>
    );
};

export default App;
