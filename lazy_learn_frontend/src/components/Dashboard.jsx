import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  const [formData, setFormData] = useState({
    study_hours_per_week: '',
    attendance_percentage: '',
    previous_quiz_avg: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [newStudent, setNewStudent] = useState({ first_name: '', last_name: '' });
  const [addMessage, setAddMessage] = useState('');

  // --- Security Configuration ---
  const token = localStorage.getItem('token');
  const authConfig = {
    headers: { Authorization: `Token ${token}` }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/students/', authConfig);
      setStudents(response.data);
      if (response.data.length > 0) {
        setSelectedStudentId(response.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // --- NEW: Handle Edit Button Click ---
  const handleEditClick = () => {
    if (!selectedStudentId) return;
    
    // Find the student from the array to grab their name
    const studentToEdit = students.find(s => s.id === parseInt(selectedStudentId));
    if (studentToEdit) {
      // Try to split the name into first and last if your API combines it, 
      // otherwise fallback to empty strings to avoid errors
      const nameParts = studentToEdit.name ? studentToEdit.name.split(' ') : [];
      setNewStudent({
        first_name: studentToEdit.first_name || nameParts[0] || '',
        last_name: studentToEdit.last_name || nameParts.slice(1).join(' ') || ''
      });
      
      setIsEditing(true);
      setEditingStudentId(studentToEdit.id);
    }
  };

  // --- MODIFIED: Handles both Adding and Updating ---
  const handleAddOrUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // --- DO UPDATE (PUT) ---
        const response = await axios.put(`http://127.0.0.1:8000/api/students/${editingStudentId}/update/`, newStudent, authConfig);
        
        // Update the specific student in our local state list
        setStudents(students.map(s => s.id === editingStudentId ? response.data : s));
        
        setAddMessage(`Successfully updated!`);
        setIsEditing(false);
        setEditingStudentId(null);
      } else {
        // --- DO ADD (POST) ---
        const response = await axios.post('http://127.0.0.1:8000/api/students/add/', newStudent, authConfig);
        setStudents([...students, response.data]);
        setSelectedStudentId(response.data.id);
        setAddMessage(`Successfully added ${response.data.name || newStudent.first_name}!`);
      }
      
      // Clear out the form
      setNewStudent({ first_name: '', last_name: '' }); 
      setTimeout(() => setAddMessage(''), 3000);
      
    } catch (err) {
      console.error("Failed to save student:", err);
      setAddMessage("Error saving student.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingStudentId(null);
    setNewStudent({ first_name: '', last_name: '' });
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudentId) return; 
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/delete/${selectedStudentId}/`, authConfig);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict/', {
        student_id: selectedStudentId, 
        ...formData
      }, authConfig);
      
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
      <div className="dashboard-container split-section">
        {/* Dynamic Header */}
        <h2>{isEditing ? "Edit Student" : "Add New Student"}</h2>
        
        {/* Pointed to the new AddOrUpdate handler */}
        <form onSubmit={handleAddOrUpdateStudent} className="ai-form">
          <div className="input-group">
            <label>First Name:</label>
            <input type="text" name="first_name" value={newStudent.first_name} onChange={handleNewStudentChange} required />
          </div>
          <div className="input-group">
            <label>Last Name:</label>
            <input type="text" name="last_name" value={newStudent.last_name} onChange={handleNewStudentChange} required />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="add-btn">
              {isEditing ? "Update Student" : "Add Student"}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {addMessage && <div className="success-message">{addMessage}</div>}
      </div>

      <div className="dashboard-container split-section">
        <h2>AI Prediction Dashboard</h2>
        <form onSubmit={handleSubmit} className="ai-form">
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
              {/* --- NEW: Edit Button Placed Here --- */}
              <button type="button" onClick={handleEditClick} className="edit-btn">Edit</button>
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