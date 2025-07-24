/* global webkitSpeechRecognition */
import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import currencyIcon from './assets/icons/rupee-symbol.svg';
import creditIcon from './assets/icons/e-credit.svg';
import analystIcon from './assets/icons/user.svg';
import supportIcon from './assets/icons/support.svg';
import elearningIcon from './assets/icons/elearning.png';
import logoutIcon from './assets/icons/logout.png';

const LandingPage = () => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const recognitionRef = useRef(null);
    const recognitionRunningRef = useRef(false);


    const speakText = (text, callback = null) => {
        if ('speechSynthesis' in window && ttsEnabled) {
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

    const handleNavigation = (path) => {
        if (isLoggedIn) {
            window.location.href = path;
        } else {
            window.location.href = '/login';
        }
    };

    const instructions = 'Welcome to DB Pocket. Say currency, credit, analytics, support, e-learning or say disable voice to mute me.';

    const processCommand = (transcript) => {
        const command = transcript.toLowerCase();
        console.log("Heard:", command);

        if (command.includes('bye')) {
            setTtsEnabled(false);
        } else if (command.includes('hi')) {
            setTtsEnabled(true);
            speakText("Voice enabled");
        } else if (command.includes('currency')) {
            handleNavigation('/currency');
        } else if (command.includes('credit')) {
            handleNavigation('/credit');
        } else if (command.includes('analytics') || command.includes('analysis')) {
            handleNavigation('/analytics');
        } else if (command.includes('support')) {
            window.location.href = '/support';
        } else if (command.includes('e-learning') || command.includes('learning')) {
            window.location.href = '/elearning';
        } else if (command.includes('logout')) {
            localStorage.clear();
            window.location.href = '/login';
        } else if (command.includes('say again')) {
            speakText(instructions);
        } else {
            speakText('Command not recognized. Try saying currency, credit, analytics, support, or e-learning.');
        }
    };

    const startVoiceRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) return;

        if (recognitionRunningRef.current) return;

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = true;

        recognition.onstart = () => {
            recognitionRunningRef.current = true;
            console.log('🎤 Voice recognition started');
        };

        recognition.onend = () => {
            recognitionRunningRef.current = false;
            console.log('🎤 Voice recognition ended');
            setTimeout(() => startVoiceRecognition(), 800);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            processCommand(transcript);
        };

        recognition.onerror = (e) => {
            recognitionRunningRef.current = false;
            console.error('Speech recognition error:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };


    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRunningRef.current = false;
        }
    };


    useEffect(() => {
        const onUserClick = () => {
            speakText(instructions);
            startVoiceRecognition();
            window.removeEventListener('click', onUserClick);
        };
        window.addEventListener('click', onUserClick);

        return () => stopRecognition();
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

                <button
                    className="toggle-button"
                    onClick={() => {
                        const newState = !ttsEnabled;
                        setTtsEnabled(newState);
                        if (newState) speakText("Voice enabled");
                    }}
                >
                    {ttsEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
                </button>

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

export default LandingPage