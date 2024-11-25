import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoggedInUserDietPage = () => {
  const [userDiets, setUserDiets] = useState([]); // State to store diets
  const [message, setMessage] = useState(''); // State to display messages

  // Fetch diets for the logged-in user
  const fetchUserDiets = async () => {
    const token = localStorage.getItem('token'); // Fetch token from localStorage

    if (!token) {
      setMessage('No authorization token found');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3002/user_diets/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDiets(response.data); // Set fetched diets
      setMessage(''); // Clear any previous message
    } catch (error) {
      setMessage('Failed to fetch diets');
      console.error(error);
    }
  };

  // UseEffect to fetch diets on component mount
  useEffect(() => {
    fetchUserDiets();
  }, []);

  return (
    <div>
      <h1>Your Diet Plans</h1>
      {message && <p>{message}</p>}

      {/* Display user diets */}
      {userDiets.length > 0 ? (
        <ul>
          {userDiets.map((diet, index) => (
            <li key={index}>
              <p>
                <strong>Meal Description:</strong> {diet.diet_description} | 
                <strong> Meal Time:</strong> {diet.diet_time} | 
                <strong> Added by Trainer ID:</strong> {diet.trainer_id}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No diets found for your account.</p>
      )}
    </div>
  );
};

export default LoggedInUserDietPage;
