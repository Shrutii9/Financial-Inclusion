/* global webkitSpeechRecognition */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';
import leftImage from './assets/images/Signup3.jpg';
import { addUser } from './db';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        mobilenumber: '',
        country: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [mode, setMode] = useState(null);
    const [currentField, setCurrentField] = useState(null);
    const [listening, setListening] = useState(false);
    const navigate = useNavigate();

    const speakText = (text, callback = null) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = 'en-US';
            speech.onend = () => {
                if (callback) callback();
            };
            window.speechSynthesis.speak(speech);
        }
    };

    const startSpeechRecognition = (field, onComplete) => {
        if ('webkitSpeechRecognition' in window) {
            setListening(true);
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                setListening(false);
                let transcript = event.results[0][0].transcript;

                if (field === 'email') {
                    transcript = transcript.replace(/at the rate/gi, '@').replace(/ /g, '');
                }

                setFormData((prev) => ({
                    ...prev,
                    [field]: transcript,
                }));

                speakText(`You entered ${transcript}`, onComplete);
            };

            recognition.onerror = () => {
                setListening(false);
                setError('Speech recognition failed. Please try again.');
            };

            recognition.start();
        }
    };

    const handleSubmit = () => {
        const { name, age, mobilenumber, country, email, password, confirmPassword } = formData;

        if (!name || !age || !mobilenumber || !country || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            speakText('All fields are required. Please fill them before submitting.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            speakText('Passwords do not match. Please re-enter.');
            return;
        }

        addUser({ name, age, country, mobilenumber, email, password });

        setError('');
        setSuccess('Registration successful! Redirecting to login...');
        speakText('Registration successful! Redirecting to login.', () => {
            navigate('/login');
        });
    };

    const proceedToNextField = (current) => {
        const fieldOrder = ['name', 'age', 'mobilenumber', 'country', 'email', 'password', 'confirmPassword'];
        const currentIndex = fieldOrder.indexOf(current);
        if (currentIndex < fieldOrder.length - 1) {
            const nextField = fieldOrder[currentIndex + 1];
            setCurrentField(nextField);
            speakText(`Please provide your ${nextField}`, () =>
                startSpeechRecognition(nextField, () => proceedToNextField(nextField))
            );
        } else {
            speakText('All fields are filled. Press Enter to submit.');
        }
    };

    useEffect(() => {
        const welcomeMessage =
            'Welcome to the registration page. Say "typing mode" to use your keyboard, or say "speaking mode" to provide your details verbally.';
        speakText(welcomeMessage, () => {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                if (transcript.includes('typing mode')) {
                    setMode('typing');
                    speakText('Typing mode activated. Please fill out the form.');
                } else if (transcript.includes('speaking mode')) {
                    setMode('speaking');
                    setCurrentField('name');
                    speakText('Speaking mode activated. Please provide your name.', () =>
                        startSpeechRecognition('name', () => proceedToNextField('name'))
                    );
                } else {
                    speakText('Command not recognized. Please say "typing mode" or "speaking mode".');
                }
            };

            recognition.onerror = () => {
                console.error('Speech recognition error.');
            };

            recognition.start();
        });
    }, []);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [formData]);

    return (
        <div className="registration-page">
            <div className="left-section">
                <h2>Join Inclusive Careers</h2>
                <p>
                    Register now to explore opportunities and unlock your potential. Easy, accessible, and empowering for everyone!
                </p>
                <img src={leftImage} alt="Register" />
            </div>

            <div className="right-section">
                <h1>Registration</h1>
                {mode === 'speaking' && <p className="instructions">Speaking Mode Active</p>}
                {listening && <p className="listening-indicator">Listening...</p>}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Mobile Number</label>
                        <input
                            type="tel"
                            name="mobilenumber"
                            value={formData.mobilenumber}
                            onChange={(e) => setFormData({ ...formData, mobilenumber: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <button type="button" onClick={handleSubmit}>
                        Register
                    </button>
                    <div className="alt-login">
                    <p>
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
                </form>
                
            </div>
        </div>
    );
};

export default RegistrationPage;
