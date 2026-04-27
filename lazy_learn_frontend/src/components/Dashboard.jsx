import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // State for the AI Prediction
  const [formData, setFormData] = useState({
    study_hours_per_week: '',
    attendance_percentage: '',
    previous_quiz_avg: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // State for the New Student Form
  const [newStudent, setNewStudent] = useState({ first_name: '', last_name: '' });
  const [addMessage, setAddMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/students/');
      setStudents(response.data);
      if (response.data.length > 0) {
        setSelectedStudentId(response.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  // Handle typing in the AI prediction form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle typing in the Add Student form
  const handleNewStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // Submit the New Student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/students/add/', newStudent);
      
      // Add the new student to our dropdown list
      setStudents([...students, response.data]);
      
      // Automatically select them in the dropdown
      setSelectedStudentId(response.data.id);
      
      // Clear the form and show a success message
      setNewStudent({ first_name: '', last_name: '' });
      setAddMessage(`Successfully added ${response.data.name}!`);
      setTimeout(() => setAddMessage(''), 3000); // Hide message after 3 seconds
    } catch (err) {
      console.error("Failed to add student:", err);
      setAddMessage("Error adding student. Check if Django is running.");
    }
  };

  // Submit the AI Prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict/', {
        student_id: selectedStudentId, 
        ...formData
      });
      
      const predictionValue = response.data.prediction;
      if (predictionValue === true || predictionValue === "Pass") {
          setResult("Pass");
      } else {
          setResult("Fail");
      }
    } catch (err) {
      setError("AI Communication Failure. Is the Django server running?");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      
      {/* ADD STUDENT SECTION */}
      <div className="dashboard-container split-section">
        <h2>Add New Student</h2>
        <form onSubmit={handleAddStudent} className="ai-form">
          <div className="input-group">
            <label>First Name:</label>
            <input type="text" name="first_name" value={newStudent.first_name} onChange={handleNewStudentChange} required />
          </div>
          <div className="input-group">
            <label>Last Name:</label>
            <input type="text" name="last_name" value={newStudent.last_name} onChange={handleNewStudentChange} required />
          </div>
          <button type="submit" className="add-btn">Add Student</button>
        </form>
        {addMessage && <div className="success-message">{addMessage}</div>}
      </div>

      {/* AI PREDICTION SECTION */}
      <div className="dashboard-container split-section">
        <h2>AI Prediction Dashboard</h2>
        <form onSubmit={handleSubmit} className="ai-form">
          <div className="input-group">
            <label>Select Student:</label>
            <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} required className="student-dropdown">
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name ? student.name : `Student #${student.id}`}
                </option>
              ))}
            </select>
          </div>

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

        {result && (
          <div className={`result-box ${result === 'Pass' ? 'pass' : 'fail'}`}>
            <h3>AI Prediction: Student will {result}!</h3>
          </div>
        )}
        
        {error && <div className="error-box">{error}</div>}
      </div>

    </div>
  );
}