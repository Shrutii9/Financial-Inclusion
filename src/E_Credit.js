import React, { useState, useEffect, useRef } from 'react';
import './E_Credit.css';
import BgCredit from './assets/icons/ECreditbg.jpg';

const fields = [
  { label: "Loan Type", name: "loanType" },
  { label: "Loan Amount Requested", name: "loanAmount" },
  { label: "Employment Status", name: "employmentStatus" },
  { label: "Monthly Income", name: "monthlyIncome" },
  { label: "Existing EMIs Monthly", name: "existingEmis" },
  { label: "Debt to Income Ratio", name: "debtToIncomeRatio" },
  { label: "Property Ownership Status", name: "propertyOwnership" },
  { label: "Residential Address", name: "address" },
  { label: "Applicant Age", name: "age" },
  { label: "Gender", name: "gender" },
  { label: "Number of Dependents", name: "dependents" },
  { label: "Asset Type Valuation", name: "assetValuation" }
];

const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-IN';

const Ecredit = () => {
  const [formData, setFormData] = useState({});
  const [listeningField, setListeningField] = useState(null);
  const [verified, setVerified] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  // New state for prediction result popup
  const [showResultModal, setShowResultModal] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const fileInputRef = useRef(null);
  const verifyBtnRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    synth.cancel();
    synth.speak(utter);
  };

  const handleMicClick = (fieldName) => {
    if (!verified) {
      speak("Please verify yourself first.");
      return;
    }
    recognition.abort();
    setListeningField(fieldName);
    speak(`Listening for ${fieldName}`);
    try {
      recognition.start();
    } catch (error) {
      console.error('Recognition start failed:', error);
    }
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (listeningField) {
      setFormData(prev => ({ ...prev, [listeningField]: transcript }));
      setListeningField(null);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    speak('Sorry, I could not understand. Please try again.');
    setListeningField(null);
  };

  const handleFocus = (label) => {
    if (!verified) {
      speak("Please verify yourself first before filling the form.");
      return;
    }
    speak(`Enter ${label}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      speak("Please verify yourself first.");
      alert('Please verify yourself first.'); // Using custom alert as per previous instructions
      return;
    }

    // Construct the payload for Vertex AI
    const payload = {
      instances: [
        {
          "Application_Date": new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
          "Loan_Type": formData.loanType || "",
          "Loan_Amount_Requested": parseFloat(formData.loanAmount).toFixed(1) || "0.0",
          "Interest_Rate_Offered": "9.9", // Example static value, adjust as needed
          "Employment_Status": formData.employmentStatus || "",
          "Monthly_Income": parseFloat(formData.monthlyIncome).toFixed(1) || "0.0",
          "Existing_EMIs_Monthly": parseFloat(formData.existingEmis).toFixed(1) || "0.0",
          "Debt_to_Income_Ratio": parseFloat(formData.debtToIncomeRatio).toFixed(2) || "0.0",
          "Property_Ownership_Status": formData.propertyOwnership || "",
          "Residential_Address": formData.address || "",
          "Applicant_Age": formData.age || "20",
          "Gender": formData.gender || "",
          "Number_of_Dependents": formData.dependents || "1",
          "Asset_Type_Valuation": parseFloat(formData.assetValuation).toFixed(1) || "0.0",
          "Loan_Limit": "1100000.0" // Example static value, adjust as needed
        }
      ]
    };

    // Vertex AI Endpoint details
    const projectId = "826364400972";
    const endpointId = "3722644005951897600";
    const location = "us-central1";
    const apiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;

    try {
      const accessToken = localStorage.getItem('vertexAIAccessToken');

      if (!accessToken) {
        console.error('Access token not found in localStorage. Please set it using the browser console.');
        speak('Access token is missing. Please set it in the browser cache.');
        alert('Error: Access token not found. Please open your browser console and set "vertexAIAccessToken" in localStorage.');
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Vertex AI Prediction Result:', result);

        // Process the prediction result
        if (result.predictions && result.predictions.length > 0) {
          const prediction = result.predictions[0];
          const classes = prediction.classes;
          const scores = prediction.scores;

          // Find the class with the highest score
          let maxScore = -1;
          let predictedClass = 'Unknown';
          for (let i = 0; i < scores.length; i++) {
            if (scores[i] > maxScore) {
              maxScore = scores[i];
              predictedClass = classes[i];
            }
          }

          setPredictionResult({
            class: predictedClass,
            score: (maxScore * 100).toFixed(2) // Convert to percentage and format
          });
          setShowResultModal(true); // Show the result popup
          speak(`Prediction received: ${predictedClass} with ${maxScore.toFixed(2)} confidence.`);
        } else {
          speak('Form submitted successfully, but no valid prediction found.');
          alert('Form submitted successfully, but no valid prediction found.');
        }

      } else {
        const errorText = await response.text();
        console.error('Failed to get prediction from Vertex AI:', response.status, errorText);
        speak('Form submission failed. Please check the console for errors.');
        alert('Form submission failed. Check console for errors.');
      }
    } catch (error) {
      console.error('Error sending data to Vertex AI:', error);
      speak('An error occurred during form submission. Please try again.');
      alert('An error occurred during form submission. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      localStorage.setItem("uploadedFileName", file.name);
    }
  };

  const handleVerify = () => {
    if (uploadedFile) {
      setVerified(true);
      speak("You are now verified. You may fill the form.");
    } else {
      speak("Please upload a file first to verify.");
    }
  };

  // TTS prevention logic
  useEffect(() => {
    const handleClick = (e) => {
      const isFileInput = fileInputRef.current?.contains(e.target);
      const isVerifyBtn = verifyBtnRef.current?.contains(e.target);

      if (!verified && !isFileInput && !isVerifyBtn) {
        e.stopPropagation();
        e.preventDefault();
        speak("Please verify yourself first before filling the form.");
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [verified]);

  // Capture modal logic
  const openCamera = async () => {
    setShowCaptureModal(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    setCapturedImage(dataURL);
  };

  const handleDoneCapture = () => {
    if (capturedImage) {
      localStorage.setItem('capturedDocument', capturedImage);
      speak("Document captured and saved.");
    }
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCaptureModal(false);
  };

  return (
    <div className="ecredit-container">
      <h2 className="form-title">E-Credit Application Form</h2>

      <div className="form-wrapper">
        <div className="image-left">
          <img src={BgCredit} alt="Form Illustration" />
        </div>

        <form className="ecredit-form" onSubmit={handleSubmit}>
          <div className="form-left">
            <h4>Verification</h4>
            <div ref={fileInputRef}>
              <input type="file" onChange={handleFileChange} />
            </div>
            <div ref={verifyBtnRef}>
              <button type="button" onClick={handleVerify} className="verify-btn">Verify</button>
            </div>
            <div>
              <button type="button" className="verify-btn" style={{ marginTop: '10px' }} onClick={openCamera}>
                Capture Document
              </button>
            </div>
            {verified && <span className="verified-msg">✅ Verified</span>}
          </div>

          <div className="form-right">
            {fields.map(({ label, name }) => (
              <div key={name} className="form-group">
                <label htmlFor={name}>{label}</label>
                <div className="input-with-mic">
                  <input
                    id={name}
                    type="text"
                    value={formData[name] || ''}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                    onFocus={() => handleFocus(label)}
                    disabled={!verified}
                  />
                  <button
                    type="button"
                    onClick={() => handleMicClick(name)}
                    disabled={!verified}
                  >🎤</button>
                </div>
              </div>
            ))}
            <div className="submit-btn-container">
              <button type="submit" className="submit-btn" disabled={!verified}>Submit</button>
            </div>
          </div>
        </form>
      </div>

      {/* Capture and Prediction Modals remain unchanged */}
      {showCaptureModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Capture Document</h3>
            <video ref={videoRef} autoPlay playsInline className="video-preview" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {capturedImage && <img src={capturedImage} alt="Captured" className="captured-img" />}
            <div style={{ marginTop: '10px' }}>
              <button onClick={captureImage}>Capture</button>
              <button onClick={handleDoneCapture} style={{ marginLeft: '10px' }}>Done</button>
            </div>
          </div>
        </div>
      )}

      {showResultModal && predictionResult && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Prediction Result</h3>
            <p>
              <strong>Predicted Status:</strong>{" "}
              <span style={{ fontWeight: 'bold', color: predictionResult.class === 'Approved' ? 'green' : predictionResult.class === 'Rejected' ? 'red' : 'orange' }}>
                {predictionResult.class}
              </span>
            </p>
            <p><strong>Confidence:</strong> {predictionResult.score}%</p>
            <button onClick={() => setShowResultModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ecredit;
