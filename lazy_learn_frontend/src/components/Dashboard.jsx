import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
  // --- STATE VARIABLES ---
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // State for the AI Prediction Form
  const [formData, setFormData] = useState({
    study_hours_per_week: '',
    attendance_percentage: '',
    previous_quiz_avg: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // State for the Add New Student Form
  const [newStudent, setNewStudent] = useState({ first_name: '', last_name: '' });
  const [addMessage, setAddMessage] = useState('');

  // --- LIFECYCLE ---
  // Fetch students as soon as the dashboard loads
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

  // --- EVENT HANDLERS ---
  
  // Handle typing in the AI prediction form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle typing in the Add Student form
  const handleNewStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // 1. CREATE: Add a new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/students/add/', newStudent);
      
      setStudents([...students, response.data]);
      setSelectedStudentId(response.data.id);
      setNewStudent({ first_name: '', last_name: '' }); // Clear form
      
      setAddMessage(`Successfully added ${response.data.name}!`);
      setTimeout(() => setAddMessage(''), 3000);
    } catch (err) {
      console.error("Failed to add student:", err);
      setAddMessage("Error adding student. Check if Django is running.");
    }
  };

  // 2. DELETE: Remove a student
  const handleDeleteStudent = async () => {
    if (!selectedStudentId) return; 
    
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/delete/${selectedStudentId}/`);
      
      // Update UI by filtering out the deleted student
      const remainingStudents = students.filter(student => student.id !== parseInt(selectedStudentId));
      setStudents(remainingStudents);
      
      if (remainingStudents.length > 0) {
        setSelectedStudentId(remainingStudents[0].id);
      } else {
        setSelectedStudentId('');
      }
      
      setResult(null); 
    } catch (err) {
      console.error("Failed to delete student:", err);
      setError("Error deleting student.");
    }
  };

  // 3. AI PREDICTION: Submit metrics to the model
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

  // --- RENDER (UI) ---
  return (
    <div className="dashboard-wrapper">
      
      {/* SECTION 1: Add Student */}
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

      {/* SECTION 2: AI Prediction */}
      <div className="dashboard-container split-section">
        <h2>AI Prediction Dashboard</h2>
        <form onSubmit={handleSubmit} className="ai-form">
          
          {/* Dropdown & Delete Button */}
          <div className="input-group">
            <label>Select Student:</label>
            <div className="dropdown-with-button">
              <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} required className="student-dropdown">
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name ? student.name : `Student #${student.id}`}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleDeleteStudent} className="delete-btn">Delete</button>
            </div>
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

        {/* Display Prediction Result */}
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