import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editableEmailBody, setEditableEmailBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, jobDesc }),
      });
      const result = await response.json();
      setResponseData(result);
      setEditableEmailBody(result.email_body); // Set editable body
    } catch (error) {
      alert('Error sending data to backend');
    }
    setLoading(false);
  };

  function extractSubject(emailBody) {
    const match = emailBody.match(/Subject:\s*(.*)/i);
    return match ? match[1].trim() : "Application for the job";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Email Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description:</label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Submit
          </button>
        </form>
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-indigo-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-indigo-700 font-medium">Drafting your email...</span>
            </div>
          </div>
        )}
        {responseData && (
          <div className="mt-8 bg-indigo-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Drafted Email Details</h3>
            <p><span className="font-semibold">Email:</span> {responseData.email}</p>
            <p><span className="font-semibold">Job Description:</span> {responseData.jobDesc}</p>
            <p><span className="font-semibold">Extracted Keywords:</span> {responseData.keywords.join(', ')}</p>
            <p><span className="font-semibold">Matched Skills:</span> {responseData.matched_skills.join(', ')}</p>
            <p className="font-semibold mt-4">Email Body:</p>
            <textarea
              className="w-full bg-white rounded p-4 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={8}
              value={editableEmailBody}
              onChange={e => setEditableEmailBody(e.target.value)}
            />
            <button
              className="mt-4 w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              onClick={() => {
                const recipient = responseData.email;
                const subjectText = extractSubject(editableEmailBody);
                const subject = encodeURIComponent(subjectText);
                // Remove the subject line from the body if present
                const body = encodeURIComponent(editableEmailBody.replace(/Subject:\s*.*\n?/i, ''));
                window.open(
                  `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}&from=mahadevanmn10@gmail.com`,
                  '_blank'
                );
              }}
            >
              Send Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
