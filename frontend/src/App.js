import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, jobDesc }),
      });
      const result = await response.json();
      setResponseData(result);
    } catch (error) {
      alert('Error sending data to backend');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Email Application</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email ID:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Job Description:</label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              required
              rows={5}
              cols={40}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {responseData && (
          <div style={{ marginTop: '2rem', textAlign: 'left', background: '#222', padding: '1rem', borderRadius: '8px' }}>
            <h3>Drafted Email Details</h3>
            <p><strong>Email:</strong> {responseData.email}</p>
            <p><strong>Job Description:</strong> {responseData.jobDesc}</p>
            <p><strong>Extracted Keywords:</strong> {responseData.keywords.join(', ')}</p>
            <p><strong>Matched Skills:</strong> {responseData.matched_skills.join(', ')}</p>
            <p><strong>Email Body:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#333', padding: '1rem', borderRadius: '4px' }}>
              {responseData.email_body}
            </pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
