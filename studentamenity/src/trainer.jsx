import React, { useState } from 'react';
import axios from 'axios';

const AddDietPlan = () => {
  const [studentId, setStudentId] = useState('');
  const [meals, setMeals] = useState([{ time: '', description: '' }]);

  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index][field] = value;
    setMeals(updatedMeals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.post(
          'http://localhost:3002/dietplan', // Updated endpoint URL
          { 
            studentId, 
            meals 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach Authorization header
              'Content-Type': 'application/json' // Specify JSON content type
            }
          }
        );
        alert('Diet plan added successfully!');
      } catch (err) {
        console.error('Error adding diet plan:', err.response?.data || err.message);
        alert('Failed to add diet plan');
      }
    }      

  return (
    <div>
      <h2>Add Diet Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        {meals.map((meal, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Meal Time (e.g., Breakfast)"
              value={meal.time}
              onChange={(e) => handleMealChange(index, 'time', e.target.value)}
            />
            <input
              type="text"
              placeholder="Description (e.g., 2 boiled eggs)"
              value={meal.description}
              onChange={(e) => handleMealChange(index, 'description', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={() => setMeals([...meals, { time: '', description: '' }])}>
          Add Another Meal
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddDietPlan;
