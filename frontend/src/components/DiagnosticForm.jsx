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
      const response = await chatWithAI(question, result);
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

      {/* ── HERO HEADER ── */}
      <header className="lm-hero">
        <div className="lm-hero-bg-grid" aria-hidden="true" />
        <div className="lm-hero-inner">
          <div className="lm-hero-brand">
            <div className="lm-hero-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <defs>
                  <linearGradient id="heroGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38bdf8"/>
                    <stop offset="1" stopColor="#818cf8"/>
                  </linearGradient>
                </defs>
                <rect width="44" height="44" rx="12" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.25)" strokeWidth="1"/>
                <path d="M22 9v26M13 16l9-7 9 7M13 28l9 7 9-7" stroke="url(#heroGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="22" cy="22" r="3" fill="url(#heroGrad)" opacity="0.7"/>
              </svg>
            </div>
            <div>
              <h1 className="lm-hero-title">AscendAI</h1>
              <p className="lm-hero-subtitle">AI Elevator Maintenance Intelligence Platform</p>
            </div>
          </div>
          <div className="lm-hero-meta">
            <div className="lm-meta-chip lm-chip-online">
              <span className="lm-chip-dot" />
              System Online
            </div>
            <div className="lm-meta-chip lm-chip-neutral">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{marginRight:5}}>
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M6 3.5v3l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              KONE Project
            </div>
          </div>
        </div>
      </header>

      {/* ── INPUT COMMAND CARD ── */}
      <section className="lm-card lm-command-card">
        <div className="lm-card-eyebrow">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="14" height="14" rx="3" stroke="#38bdf8" strokeWidth="1.3"/>
            <path d="M4 8h8M4 5h5M4 11h6" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Fault Input
        </div>

        <div className="lm-input-row">
          <div className="lm-field-group lm-field-code">
            <label className="lm-label" htmlFor="errorCode">
              <span className="lm-label-dot" />
              Error Code
            </label>
            <div className="lm-input-wrap">
              <span className="lm-input-prefix">#</span>
              <input
                id="errorCode"
                className="lm-input lm-input-code"
                type="text"
                placeholder="E204"
                value={errorCode}
                onChange={(e) => setErrorCode(e.target.value)}
              />
            </div>
          </div>

          <div className="lm-or-divider" aria-hidden="true">
            <span className="lm-or-line" />
            <span className="lm-or-text">OR</span>
            <span className="lm-or-line" />
          </div>

          <div className="lm-field-group lm-field-symptoms">
            <label className="lm-label" htmlFor="symptoms">
              <span className="lm-label-dot" />
              Symptom Description
            </label>
            <textarea
              id="symptoms"
              className="lm-textarea"
              placeholder="Describe the observed fault in detail — unusual sounds, motion anomalies, door behaviour…"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows="4"
            />
          </div>
        </div>

        <div className="lm-btn-row">
          <button className="lm-btn lm-btn-primary" onClick={handleAnalyze}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M5.5 8l2 2 3-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Run Diagnostics
          </button>
          <button className="lm-btn lm-btn-ghost" onClick={handleClear}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Clear
          </button>
        </div>
      </section>

      {/* ── LOADING ── */}
      {loading && (
        <div className="lm-card lm-loading-card" role="status" aria-live="polite">
          <div className="lm-loading-rings" aria-hidden="true">
            <span className="lm-ring lm-ring-1" />
            <span className="lm-ring lm-ring-2" />
            <span className="lm-ring lm-ring-3" />
          </div>
          <div className="lm-loading-copy">
            <span className="lm-loading-title">Processing Fault Data</span>
            <span className="lm-loading-stages">
              <span className="lm-stage lm-stage-active">Correlating error patterns</span>
              <span className="lm-stage-sep">·</span>
              <span className="lm-stage">Generating AI report</span>
              <span className="lm-stage-sep">·</span>
              <span className="lm-stage">Compiling solution</span>
            </span>
          </div>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && (
        <div className="lm-card lm-error-card" role="alert">
          <div className="lm-error-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#f87171" strokeWidth="1.5"/>
              <path d="M11 6.5v5" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11" cy="15" r="1" fill="#f87171"/>
            </svg>
          </div>
          <div>
            <p className="lm-error-title">Diagnostic Error</p>
            <p className="lm-error-body">{error}</p>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {result && (
        <>
          {/* Diagnosis Result */}
          <section className="lm-card lm-result-card">
            <div className="lm-card-eyebrow">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="#38bdf8" strokeWidth="1.3"/>
                <path d="M5.5 8l2 2 3-3" stroke="#38bdf8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Diagnosis Result
            </div>

            <div className="lm-result-hero">
              <div className="lm-result-code-block">
                <span className="lm-result-code-label">Fault Code</span>
                <span className="lm-result-code-value">{result.error_code}</span>
              </div>
              <div className="lm-result-severity-block">
                <span className="lm-result-code-label">Severity Level</span>
                <span className={getSeverityClass(result.severity)}>{result.severity}</span>
              </div>
              <div className="lm-result-time-block">
                <span className="lm-result-code-label">Est. Repair Time</span>
                <span className="lm-result-time-value">{result.repair_time}</span>
              </div>
            </div>

            <div className="lm-result-details">
              <div className="lm-detail-item">
                <span className="lm-detail-key">Root Cause</span>
                <p className="lm-detail-val">{result.cause}</p>
              </div>
              <div className="lm-detail-divider" />
              <div className="lm-detail-item">
                <span className="lm-detail-key">Recommended Solution</span>
                <p className="lm-detail-val">{result.solution}</p>
              </div>
            </div>
          </section>

          {/* AI Intelligence Report */}
          <section className="lm-card lm-report-card">
            <div className="lm-card-eyebrow lm-eyebrow-indigo">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="1" width="12" height="14" rx="2" stroke="#a78bfa" strokeWidth="1.3"/>
                <path d="M5 5h6M5 8h6M5 11h4" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              AI Intelligence Report
            </div>
            <div className="lm-report-terminal">
              <div className="lm-terminal-bar" aria-hidden="true">
                <span className="lm-dot lm-dot-red" />
                <span className="lm-dot lm-dot-yellow" />
                <span className="lm-dot lm-dot-green" />
                <span className="lm-terminal-label">ascendai_report.txt</span>
              </div>
              <pre className="lm-report-body">{result.ai_report}</pre>
            </div>
          </section>

          {/* AI Chat Panel */}
          <section className="lm-card lm-chat-card">
            <div className="lm-card-eyebrow lm-eyebrow-cyan">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2v-2H3a1 1 0 01-1-1V3z" stroke="#38bdf8" strokeWidth="1.3"/>
                <path d="M5 6h6M5 8.5h4" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Ask AscendAI
            </div>

            <div className="lm-chat-input-area">
              <div className="lm-chat-avatar" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="url(#chatGrad)" strokeWidth="1.3"/>
                  <path d="M10 5v10M5 10h10" stroke="url(#chatGrad)" strokeWidth="1.4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="chatGrad" x1="1" y1="1" x2="19" y2="19" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38bdf8"/>
                      <stop offset="1" stopColor="#818cf8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <textarea
                className="lm-textarea lm-chat-textarea"
                placeholder="Ask a follow-up question about this fault…"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows="3"
              />
            </div>

            <div className="lm-chat-actions">
              <button className="lm-btn lm-btn-primary lm-btn-send" onClick={handleChat}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8l12-6-5 6 5 6-12-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
                Send
              </button>
            </div>

            {chatLoading && (
              <div className="lm-chat-thinking" role="status">
                <div className="lm-thinking-dots">
                  <span className="lm-tdot" />
                  <span className="lm-tdot" />
                  <span className="lm-tdot" />
                </div>
                <span className="lm-thinking-label">AscendAI is thinking…</span>
              </div>
            )}

            {chatAnswer && (
              <div className="lm-chat-answer">
                <div className="lm-answer-header">
                  <div className="lm-answer-avatar" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="url(#ansGrad)" strokeWidth="1.2"/>
                      <defs>
                        <linearGradient id="ansGrad" x1="1" y1="1" x2="15" y2="15" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#38bdf8"/>
                          <stop offset="1" stopColor="#818cf8"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="lm-answer-from">AscendAI</span>
                </div>
                <pre className="lm-answer-body">{chatAnswer}</pre>
              </div>
            )}
          </section>
        </>
      )}
      <footer className="lm-footer">
  Developed by <strong>Hemanth Pranesh</strong> & <strong>Varsha</strong> & <strong>Ragavi</strong>
</footer>
    </div>
  );
}

export default DiagnosticForm;