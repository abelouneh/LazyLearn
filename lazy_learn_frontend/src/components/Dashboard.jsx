import { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // We will create this next!

export default function Dashboard() {
  const [formData, setFormData] = useState({
    study_hours_per_week: '',
    attendance_percentage: '',
    previous_quiz_avg: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    
    try {
      // We send the data to our Django API!
      // (We hardcode student_id: 1 for our MVP test)
      const response = await axios.post('http://127.0.0.1:8000/api/predict/', {
        student_id: 1, 
        ...formData
      });
      setResult(response.data.prediction); // "Pass" or "Fail"
    } catch (err) {
      setError("AI Communication Failure. Is the Django server running?");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Teacher AI Dashboard</h2>
      <p>Enter student metrics to predict final performance.</p>
      
      <form onSubmit={handleSubmit} className="ai-form">
        <div className="input-group">
          <label>Study Hours (per week):</label>
          <input type="number" name="study_hours_per_week" onChange={handleChange} required min="0" max="40" />
        </div>
        
        <div className="input-group">
          <label>Attendance (%):</label>
          <input type="number" name="attendance_percentage" onChange={handleChange} required min="0" max="100" />
        </div>
        
        <div className="input-group">
          <label>Previous Quiz Average:</label>
          <input type="number" step="0.1" name="previous_quiz_avg" onChange={handleChange} required min="0" max="100" />
        </div>

        <button type="submit" className="predict-btn">Predict Outcome</button>
      </form>

      {/* The AI Result Display */}
      {result && (
        <div className={`result-box ${result === 'Pass' ? 'pass' : 'fail'}`}>
          <h3>AI Prediction: Student will {result}!</h3>
        </div>
      )}
      
      {error && <div className="error-box">{error}</div>}
    </div>
  );
}