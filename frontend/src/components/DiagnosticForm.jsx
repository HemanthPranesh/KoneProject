import { useState } from "react";
import { diagnoseFault, chatWithAI } from "../utils/api";
import "./DiagnosticForm.css";

function DiagnosticForm() {
  const [errorCode, setErrorCode] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState("");
const [chatAnswer, setChatAnswer] = useState("");
const [chatLoading, setChatLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setError("");
      setResult(null);
      setLoading(true);
      let payload = {};

      if (errorCode.trim()) {
        payload = { error_code: errorCode };
      } else if (symptoms.trim()) {
        payload = { symptoms: symptoms };
      } else {
        alert("Enter an error code or symptoms.");
        return;
      }

      const result = await diagnoseFault(payload);
      if (result.message) {
        setError(result.message);
        setLoading(false);
        return;
      }

      setResult(result);
      setQuestion("");
setChatAnswer("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to connect to backend.");
    }
  };

  const handleClear = () => {
  setErrorCode("");
  setSymptoms("");
  setResult(null);
  setError("");
};
const handleChat = async () => {
  if (!question.trim()) return;

  try {
    setChatLoading(true);

    const response = await chatWithAI(
      question,
      result
    );

    setChatAnswer(response.answer);

    setChatLoading(false);
  } catch (error) {
    console.error(error);

    setChatLoading(false);
  }
};

  const getSeverityClass = (severity) => {
    if (!severity) return "";
    const s = severity.toLowerCase();
    if (s === "low") return "badge badge-low";
    if (s === "medium") return "badge badge-medium";
    if (s === "high") return "badge badge-high";
    if (s === "critical") return "badge badge-critical";
    return "badge";
  };

  return (
    <div className="lm-root">
      {/* Header Card */}
      <div className="lm-card lm-header-card">
        <div className="lm-logo-row">
          <span className="lm-logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#grad)" />
              <path d="M16 7v18M9 12l7-5 7 5M9 20l7 5 7-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0ea5e9"/>
                  <stop offset="1" stopColor="#6366f1"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <div>
            <h1 className="lm-title">LiftMind</h1>
            <p className="lm-subtitle">AI-Powered Elevator Troubleshooting Assistant</p>
          </div>
        </div>
        <div className="lm-status-pill">
          <span className="lm-status-dot" />
          System Online
        </div>
      </div>

      {/* Input Card */}
      <div className="lm-card lm-input-card">
        <div className="lm-section-label">Fault Diagnostics</div>

        <div className="lm-field-group">
          <label className="lm-label" htmlFor="errorCode">Error Code</label>
          <input
            id="errorCode"
            className="lm-input"
            type="text"
            placeholder="e.g. E204"
            value={errorCode}
            onChange={(e) => setErrorCode(e.target.value)}
          />
        </div>

        <div className="lm-or-separator">
          <span className="lm-or-line" />
          <span className="lm-or-text">OR</span>
          <span className="lm-or-line" />
        </div>

        <div className="lm-field-group">
          <label className="lm-label" htmlFor="symptoms">Symptom Description</label>
          <textarea
            id="symptoms"
            className="lm-textarea"
            placeholder="Describe observed symptoms in detail…"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows="4"
          />
        </div>

        <div className="lm-btn-row">
          <button className="lm-btn lm-btn-primary" onClick={handleAnalyze}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{marginRight: 7, flexShrink: 0}}>
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Analyze
          </button>
          <button className="lm-btn lm-btn-ghost" onClick={handleClear}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{marginRight: 7, flexShrink: 0}}>
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Clear
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="lm-card lm-loading-card">
          <div className="lm-spinner" />
          <div className="lm-loading-text">
            <span className="lm-loading-title">Analyzing Fault</span>
            <span className="lm-loading-sub">Generating AI diagnostic report…</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="lm-card lm-error-card">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{flexShrink:0}}>
            <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="1.8"/>
            <path d="M10 6v5M10 13.5v.5" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Result Cards */}
      {result && (
        <>
          {/* Diagnosis Result Card */}
          <div className="lm-card lm-result-card">
            <div className="lm-section-label">Diagnosis Result</div>
            <div className="lm-result-grid">
              <div className="lm-result-item">
                <span className="lm-result-key">Error Code</span>
                <span className="lm-result-val lm-mono">{result.error_code}</span>
              </div>
              <div className="lm-result-item">
                <span className="lm-result-key">Severity</span>
                <span className={getSeverityClass(result.severity)}>{result.severity}</span>
              </div>
              <div className="lm-result-item">
                <span className="lm-result-key">Repair Time</span>
                <span className="lm-result-val">{result.repair_time}</span>
              </div>
              <div className="lm-result-item lm-result-item-full">
                <span className="lm-result-key">Cause</span>
                <span className="lm-result-val">{result.cause}</span>
              </div>
              <div className="lm-result-item lm-result-item-full">
                <span className="lm-result-key">Solution</span>
                <span className="lm-result-val">{result.solution}</span>
              </div>
            </div>
          </div>

          {/* AI Report Card */}
          <div className="lm-card lm-report-card">
            <div className="lm-report-header">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="2" width="14" height="16" rx="2" stroke="#38bdf8" strokeWidth="1.8"/>
                <path d="M7 7h6M7 10h6M7 13h4" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <span className="lm-section-label" style={{marginBottom:0}}>AI Report</span>
            </div>
            <pre className="lm-report-body">{result.ai_report}</pre>
          </div>
          <div className="lm-card lm-report-card">
  <div className="lm-report-header">
    <span className="lm-section-label">
      Ask LiftMind AI
    </span>
  </div>

  <textarea
    className="lm-textarea"
    placeholder="Ask a follow-up question..."
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    rows="3"
  />

  <div style={{ marginTop: "12px" }}>
    <button
      className="lm-btn lm-btn-primary"
      onClick={handleChat}
    >
      Send
    </button>
  </div>

  {chatLoading && (
    <p style={{ marginTop: "12px" }}>
      Thinking...
    </p>
  )}

  {chatAnswer && (
    <pre className="lm-report-body" style={{ marginTop: "16px" }}>
      {chatAnswer}
    </pre>
  )}
</div>
        </>
      )}
    </div>
  );
}

export default DiagnosticForm;