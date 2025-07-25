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
    const [showFloatBtns, setShowFloatBtns] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I assist you today?' }]);
    const [inputText, setInputText] = useState('');
    const [showElearningChat, setShowElearningChat] = useState(false);
    const [elearningMessages, setElearningMessages] = useState([
        { sender: 'bot', text: 'Welcome to E-learning support! What would you like to learn today?' }
    ]);
    const [elearningInput, setElearningInput] = useState('');


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
            handleNavigation('/ecredit');
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

    const handleSend = () => {
        if (inputText.trim() === '') return;
        setMessages((prev) => [...prev, { sender: 'user', text: inputText }]);

        // Simulate bot reply
        setTimeout(() => {
            setMessages((prev) => [...prev, { sender: 'bot', text: 'Thanks! We will get back to you shortly.' }]);
        }, 1000);

        setInputText('');
    };

    const handleElearningSend = () => {
        if (elearningInput.trim() === '') return;
        setElearningMessages((prev) => [...prev, { sender: 'user', text: elearningInput }]);

        // Simulate bot reply
        setTimeout(() => {
            setElearningMessages((prev) => [...prev, { sender: 'bot', text: 'We recommend checking our beginner modules.' }]);
        }, 1000);

        setElearningInput('');
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
                <div className="logo">
                    <img src={require('./assets/icons/pocket-logo.png')} alt="dbPocket Logo" className="logo-img" />
                </div>
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
                        onClick={() => handleNavigation('/ecredit')}
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
                        onClick={() => handleNavigation('/ecredit')}
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

                {/* Floating Buttonizer Style */}
                <div className="buttonizer-container">
                    <button className="main-float-btn" onClick={() => setShowFloatBtns(!showFloatBtns)}>
                        {showFloatBtns ? '✖' : '+'}
                    </button>

                    {showFloatBtns && (
                        <div className="float-btn-group">
                            <button
                                className="float-btn"
                                onMouseEnter={() => handleHover('Support')}
                                onClick={() => {
                                    setShowChat(!showChat);
                                    setShowElearningChat(false); // close other chat
                                }}
                            >
                                <img src={supportIcon} alt="Support" />
                            </button>

                            <button
                                className="float-btn"
                                onMouseEnter={() => handleHover('E-learning')}
                                onClick={() => {
                                    setShowElearningChat(!showElearningChat);
                                    setShowChat(false); // close other chat
                                }}
                            >
                                <img src={elearningIcon} alt="E-learning" />
                            </button>
                        </div>

                    )}

                    {showChat && (
                        <div className="chat-popup">
                            <div className="chat-header">
                                <span>Support Chat</span>
                                <button onClick={() => setShowChat(false)}>✖</button>
                            </div>
                            <div className="chat-body">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`chat-message ${msg.sender}`}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input-area">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button onClick={handleSend}>Send</button>
                            </div>
                        </div>
                    )}

                    {showElearningChat && (
                        <div className="chat-popup elearning-chat">
                            <div className="chat-header">
                                <span>E-learning Chat</span>
                                <button onClick={() => setShowElearningChat(false)}>✖</button>
                            </div>
                            <div className="chat-body">
                                {elearningMessages.map((msg, index) => (
                                    <div key={index} className={`chat-message ${msg.sender}`}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input-area">
                                <input
                                    type="text"
                                    placeholder="Ask your learning question..."
                                    value={elearningInput}
                                    onChange={(e) => setElearningInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleElearningSend()}
                                />
                                <button onClick={handleElearningSend}>Send</button>
                            </div>
                        </div>
                    )}



                </div>


            </div>
        </div>
    );
};

export default LandingPage
