import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [step, setStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScores, setQuizScores] = useState(Array(20).fill(null));
  const [quizResult, setQuizResult] = useState({ type: "", score: 0 });
  const [image, setImage] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    "When a stranger talks to me, I consider it an opportunity to make a connection.",
    "Being out with a big group of friends all night can be exhausting.",
    "I consider myself to be an assertive person.",
    "It’s not unusual for me to get lost in thought around other people.",
    "I think that being on a reality show would be a nightmare.",
    "I don’t mind talking about anything, even if I’m not that knowledgeable about it.",
    "I'd rather spend one-on-one time with a close friend than get together with a friend group.",
    "It’s better to have a roommate than to live alone.",
    "It's disappointing to review my weekly schedule and see that it includes no social plans.",
    "At work meetings, I think it’s important to speak up often.",
    "I have a lot of fun playing tricks on my friends and family.",
    "I like to get my friends and co-workers excited about our plans.",
    "I don’t like to feel pushed into dancing at parties.",
    "When I'm in charge, I prefer meeting with people one-on-one to holding large brainstorming sessions.",
    "When I go to a party, I often think about how early it would be appropriate to leave.",
    "If someone is interesting enough, I could happily spend an evening just listening to their stories.",
    "In work or in life, I’d rather take some time to consider the next steps even if others are eager to rush ahead.",
    "As a kid, I was always the first to volunteer to read aloud.",
    "One of the great attractions of travel is the opportunity to meet new people.",
    "A day spent alone working on my hobbies sounds perfect."
  ];

  const handleScore = (score) => {
    const newScores = [...quizScores];
    newScores[currentQuestion] = score;
    setQuizScores(newScores);
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setStep(0);
    }
  };

  const processResults = () => {
    const extrovertIndices = [0, 2, 5, 7, 8, 9, 10, 11, 17, 18];
    let total = 0;
    quizScores.forEach((score, i) => {
      total += extrovertIndices.includes(i) ? (6 - score) : score;
    });

    let type = "";
    if (total >= 82) type = "Strongly Introverted";
    else if (total >= 64) type = "Somewhat Introverted";
    else if (total >= 37) type = "Neutral";
    else if (total >= 19) type = "Somewhat Extroverted";
    else type = "Strongly Extroverted";

    setQuizResult({ type, score: total });
    setStep(2);
  };

  const handleAiAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    try {
      const res = await axios.post('http://127.0.0.1:5001/predict', formData);
      setAiResult(res.data);
      setStep(3);
    } catch (err) {
      alert("Error processing handwriting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discovery-app">
      <main className="stage">
        {/* STEP 0: RECTIFIED HERO PAGE */}
{step === 0 && (
  <section className="hero-fullscreen fade-in">
    <div className="hero-bg-overlay"></div>
    <div className="hero-content-wrapper">
      <header className="hero-header">
        <span className="hero-badge">Psychometric Research Lab</span>
        <h1>Personality Discovery Hub</h1>
        <p className="hero-tagline">
          Reveal your hidden traits through clinical psychometrics and AI-driven handwriting analysis.
        </p>
      </header>

      <div className="hero-action-box">
        {/* RECTIFIED: Orange Pill Button */}
        <button className="btn-start-discovery pill-orange" onClick={() => setStep(1)}>
          Start Discovery
        </button>
        <p className="hero-disclaimer">
          Informational purposes only. For a medical diagnosis, please consult a professional.
        </p>
      </div>

      {/* RECTIFIED: Horizontal Stats Box */}
      <div className="hero-stats-box">
        <div className="stat-item">
          <strong>20</strong>
          <span>Key Metrics</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <strong>AI</strong>
          <span>Validation</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <strong>3D</strong>
          <span>Profiling</span>
        </div>
      </div>
    </div>
  </section>
)}
        {/* STEP 1: RECTIFIED HORIZONTAL QUIZ INTERFACE */}
{step === 1 && (
  <div className="quiz-container-fullscreen fade-in">
    {/* Question Number positioned at the top center */}
    <nav className="test-header">
      <div className="q-count-centered">
        QUESTION {currentQuestion + 1} OF 20
      </div>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${((currentQuestion + 1) / 20) * 100}%` }}></div>
      </div>
    </nav>

    <section className="quiz-card fixed-dimensions fade-in">
      <div className="question-wrapper">
        <h2 className="question-text">{questions[currentQuestion]}</h2>
      </div>

      {/* RECTIFIED: Horizontal alignment for options */}
      <div className="likert-scale-horizontal">
        {[
          { val: 1, label: "Strongly Disagree", color: "#ef4444" },
          { val: 2, label: "Disagree", color: "#f87171" },
          { val: 3, label: "Neutral", color: "#FBBF24" },
          { val: 4, label: "Agree", color: "#34d399" },
          { val: 5, label: "Strongly Agree", color: "#26C6DA" }
        ].map((option) => (
          <div key={option.val} className="option-item-horizontal">
            <button
              className={`scale-circle circle-${option.val} ${quizScores[currentQuestion] === option.val ? 'selected' : ''}`}
              onClick={() => handleScore(option.val)}
              style={{ 
                '--active-color': option.color,
                borderColor: quizScores[currentQuestion] === option.val ? option.color : 'rgba(255, 255, 255, 0.3)'
              }}
            ></button>
            <span className="label-text-horizontal" style={{ color: option.color }}>
              {option.label}
            </span>
          </div>
        ))}
      </div>

      <div className="nav-controls-centered">
        <button className="btn-back" onClick={handleBack}>Back</button>
        {currentQuestion === 19 && quizScores[19] && (
          <button className="btn-main reveal-btn" onClick={processResults} style={{ marginLeft: '20px' }}>
            Reveal Results
          </button>
        )}
      </div>
    </section>
  </div>
)}
        {/* STEP 2: CENTERED VERIFICATION BOX */}
{step === 2 && (
  <div className="discovery-app">
    <section className="verification-card glass-container fade-in">
      {/* Header Info */}
      <div className="pre-report-summary">
        <h3>Self-Reported Score: <span className="score-hl">{quizResult.score}/100</span></h3>
        <p>Your profile leans toward: <strong>{quizResult.type}</strong></p>
      </div>
      
      <hr className="glass-hr" />

      {/* Upload Zone inside the box */}
      <div className="upload-zone-centered">
        <h2>Step 2: Handwriting Verification</h2>
        <p>Upload a sample to verify your unconscious personality traits via AI.</p>
        
        <div className="file-input-wrapper">
          <input 
            type="file" 
            id="handwriting-upload" 
            onChange={(e) => setImage(e.target.files[0])} 
            accept="image/*"
          />
        </div>
      </div>

      {/* Action Button */}
      <button 
        className="btn-main pill-orange" 
        onClick={handleAiAnalysis} 
        disabled={!image || loading}
      >
        {loading ? "Analyzing Strokes..." : "Verify with AI"}
      </button>
    </section>
  </div>
)}
        {/* STEP 3: FINAL DASHBOARD REPORT */}
        {step === 3 && (
          <section className="full-report dashboard-layout fade-in">
            <div className="report-hero">
              <div className="hero-content">
                <header className="report-header">
                  <div className="status-badge">Psychometric Test Result</div>
                  <h1>{quizResult.score}/100 — {quizResult.type}</h1>
                  <p className="subtitle">Comprehensive Analysis: Self-Assessment & AI Verification</p>
                </header>
              </div>
            </div>

            <div className="results-container">
  {/* --- NEW: PERCENTAGE BREAKDOWN FEATURE --- */}
  <div className="ai-probability-section">
    <h3>AI Confidence Breakdown</h3>
    <div className="probability-grid">
      {aiResult && aiResult.probability_distribution && Object.entries(aiResult.probability_distribution).map(([className, percentage]) => (
        <div key={className} className="prob-bar-container">
          <div className="prob-labels">
            <strong>{className} Match</strong>
            <span>{percentage}</span>
          </div>
          <div className="bar-bg">
            <div 
              className="bar-fill" 
              style={{ 
                width: percentage, // Uses the "X.XX%" string from Flask
                backgroundColor: className === aiResult.personality ? '#4CAF50' : '#2196F3' 
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
              <div className="results-table">
                <div className="table-row table-header">
                  <div className="cell">Metric Source</div>
                  <div className="cell">Categorical Result</div>
                  <div className="cell">Behavioral Analysis & Indicators</div>
                </div>
                
                <div className="table-row">
                  <div className="cell source-cell">
                    <strong>Self-Reported Profile</strong>
                  </div>
                  <div className="cell score-cell">
                    <span className="type-label">{quizResult.type}</span>
                  </div>
                  <div className="cell analysis-text">
                    Your recharge style significantly influences environmental interaction. 
                    High scores indicate inward focus, while lower scores favor social energy.
                  </div>
                </div>

                <div className="table-row">
                  <div className="cell source-cell">
                    <strong>AI Subconscious Analysis</strong>
                  </div>
                  <div className="cell ai-cell">
                    <span className="type-label highlight">{aiResult?.personality || 'Neutral'}</span>
                  </div>
                  <div className="cell">
                    <div className="trait-pills">
                      {aiResult?.details?.map((d, i) => (
                        <span key={i} className="pill-tag">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

           
            {/* ... End of results-container ... */}
            
            <div className="action-footer">
              <button className="btn-main restart-btn-large" onClick={() => window.location.reload()}>
                Restart Discovery Journey
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;