import React, { useState } from 'react';
import axios from 'axios';

const AdminAddMealPage = () => {
  const [userId, setUserId] = useState('');
  const [mealDescription, setMealDescription] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null); // To store user info (name, height, weight)
  const [addedMeal, setAddedMeal] = useState(null); // To store the newly added meal info
  const [userDiets, setUserDiets] = useState([]); // To store all meals associated with the user

  const handleUserSearch = async () => {
    if (!userId) {
      setMessage('Please enter a user ID');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/user_info/${userId}`);
      setUserInfo(response.data); // Set user info from the backend
      setMessage('User found');
      // Fetch all the diets for this user after finding the user
      fetchUserDiets();
    } catch (error) {
      setMessage('User not found');
      setUserInfo(null);
    }
  };

  const fetchUserDiets = async () => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    if (!token) {
      setMessage('No authorization token found');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/user_diets/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDiets(response.data); // Set the user diets
    } catch (error) {
      setMessage('Failed to fetch user diets');
      console.error(error);
    }
  };

  const handleAddMeal = async () => {
    if (!userId || !mealDescription || !mealTime) {
      setMessage('Please provide all fields');
      return;
    }

    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    if (!token) {
      setMessage('No authorization token found');
      return;
    }

    try {
      // Sending the meal data to the backend with Bearer token for authentication
      const response = await axios.post(
        'http://localhost:3002/trainer_meals',
        {
          userId,
          mealDescription,
          mealTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Ensure the content type is set for JSON requests
          },
        }
      );

      setMessage(response.data.message); // Set success message
      setAddedMeal(response.data.meal); // Store the newly added meal in state to display it
      // Re-fetch user diets to display the updated list of meals
      fetchUserDiets();
    } catch (error) {
      setMessage('Failed to add meal');
      console.error(error); // Log error for debugging
    }
  };

  return (
    <div>
      <h1>Add Meal for User</h1>

      {/* Input for searching user */}
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleUserSearch}>Search User</button>

      {userInfo && (
        <div>
          <h3>User Information:</h3>
          <p>Name: {userInfo.user_name}</p>
          <p>Height: {userInfo.height} cm</p>
          <p>Weight: {userInfo.weight} kg</p>
        </div>
      )}

      {/* Form for adding meal */}
      <textarea
        placeholder="Enter meal description"
        value={mealDescription}
        onChange={(e) => setMealDescription(e.target.value)}
      />
      <select onChange={(e) => setMealTime(e.target.value)} value={mealTime}>
        <option value="">Select Meal Time</option>
        <option value="Morning">Morning</option>
        <option value="Afternoon">Afternoon</option>
        <option value="Evening">Evening</option>
      </select>
      <button onClick={handleAddMeal}>Add Meal</button>

      {message && <p>{message}</p>}

      {/* Display the newly added meal */}
      {addedMeal && (
        <div>
          <h3>Added Meal:</h3>
          <p><strong>Meal Description:</strong> {addedMeal.diet_description}</p>
          <p><strong>Meal Time:</strong> {addedMeal.diet_time}</p>
          <p><strong>Added by Trainer ID:</strong> {addedMeal.trainer_id}</p>
          <p><strong>User ID:</strong> {addedMeal.user_id}</p>
        </div>
      )}

      {/* Display all meals associated with the user */}
      <h3>User's Diets:</h3>
<ul>
  {userDiets.map((meal, index) => (
    <li key={index}>
      <p>
        <strong>Meal Description:</strong> {meal.diet_description} | 
        <strong> Meal Time:</strong> {meal.diet_time} | 
        <strong> Trainer ID:</strong> {meal.trainer_id} | 
        <strong> User ID:</strong> {meal.user_id}
      </p>
    </li>
  ))}
</ul>
    </div>
  );
};

export default AdminAddMealPage;
