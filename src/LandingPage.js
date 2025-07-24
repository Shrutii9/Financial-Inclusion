/* global webkitSpeechRecognition */
import React, { useEffect } from 'react';
import './LandingPage.css';
import currencyIcon from './assets/icons/rupee-symbol.svg';
import creditIcon from './assets/icons/e-credit.svg';
import analystIcon from './assets/icons/user.svg';
import supportIcon from './assets/icons/support.svg';
import elearningIcon from './assets/icons/elearning.png';
import logoutIcon from './assets/icons/logout.png';

const LandingPage = () => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    const speakText = (text, callback = null) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.onend = () => {
                if (callback) callback();
            };
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    };

    const startVoiceNavigation = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();

                if (transcript.includes('currency')) {
                    handleNavigation('/currency');
                } else if (transcript.includes('credit')) {
                    handleNavigation('/credit');
                } else if (transcript.includes('analytics') || transcript.includes('analysis')) {
                    handleNavigation('/analytics');
                } else if (transcript.includes('support')) {
                    window.location.href = '/support';
                } else if (transcript.includes('e-learning') || transcript.includes('learning')) {
                    window.location.href = '/elearning';
                } else if (transcript.includes('logout')) {
                    localStorage.clear();
                    window.location.href = '/login';
                } else if (transcript.includes('say again')) {
                    speakText(instructions, startVoiceNavigation);
                } else {
                    speakText('Command not recognized. Try saying currency, credit, analytics, support, or e-learning.', startVoiceNavigation);
                }
            };

            recognition.onerror = () => {
                speakText('There was an error. Please try again.', startVoiceNavigation);
            };

            recognition.onend = () => {
                recognition.start();
            };

            recognition.start();
        }
    };

    const handleNavigation = (path) => {
        if (isLoggedIn) {
            window.location.href = path;
        } else {
            window.location.href = '/login';
        }
    };

    const instructions = 'Welcome to DB Pocket. Say currency, credit, analytics, support, or e-learning.';

    useEffect(() => {
        const onUserClick = () => {
            speakText(instructions, startVoiceNavigation);
            window.removeEventListener('click', onUserClick);
        };
        window.addEventListener('click', onUserClick);
        return () => window.removeEventListener('click', onUserClick);
    }, []);

    const handleHover = (text) => speakText(text);

    return (
        <div className="dbhack">
            <div className="top-bar">
                <div className="logo">📘 <span className="brand">dbPocket</span></div>
                <div className="user-right">
                    <div
                        className="user-info"
                        onMouseEnter={() => handleHover('Hi Naushad')}
                    >
                        Hi Naushad
                    </div>
                    <img
                        src={logoutIcon}
                        alt="logout"
                        className="logout-icon"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        onMouseEnter={() => handleHover('Logout')}
                    />
                </div>
            </div>

            <div className="home-section">
                <h2>Home</h2>

                <div className="info-cards">
                    <div
                        className="card"
                        onMouseEnter={() => handleHover('Account Details')}
                        onClick={() => handleNavigation('/account')}
                    >
                        Account Details
                    </div>
                    <div
                        className="card"
                        onMouseEnter={() => handleHover('Credit Details')}
                        onClick={() => handleNavigation('/credit')}
                    >
                        Credit Details
                    </div>
                </div>

                <div className="icon-row">
                    <div
                        className="icon-button"
                        onMouseEnter={() => handleHover('e-Currency')}
                        onClick={() => handleNavigation('/currency')}
                    >
                        <img src={currencyIcon} alt="e-Currency" />
                        <p>e-Currency</p>
                    </div>
                    <div
                        className="icon-button"
                        onMouseEnter={() => handleHover('e-Credit')}
                        onClick={() => handleNavigation('/credit')}
                    >
                        <img src={creditIcon} alt="e-Credit" />
                        <p>e-Credit</p>
                    </div>
                    <div
                        className="icon-button"
                        onMouseEnter={() => handleHover('Analytics')}
                        onClick={() => handleNavigation('/analytics')}
                    >
                        <img src={analystIcon} alt="Analytics" />
                        <p>Analytics</p>
                    </div>
                    <div
                        className="icon-button"
                        onMouseEnter={() => handleHover('Support')}
                        onClick={() => window.location.href = '/support'}
                    >
                        <img src={supportIcon} alt="Support" />
                        <p>Support</p>
                    </div>
                    <div
                        className="icon-button"
                        onMouseEnter={() => handleHover('E-learning')}
                        onClick={() => window.location.href = '/elearning'}
                    >
                        <img src={elearningIcon} alt="E-learning" />
                        <p>E-learning</p>
                    </div>
                </div>

                <div className="quiz-section">
                    <button onMouseEnter={() => handleHover('Do you know Savings?')}>Do you know Savings?</button>
                    <button onMouseEnter={() => handleHover('Know credit eligibility?')}>Know credit eligibility?</button>
                    <button onMouseEnter={() => handleHover('Understand Finance?')}>Understand Finance?</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
