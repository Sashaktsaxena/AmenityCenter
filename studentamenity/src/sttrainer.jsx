import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewDietPlan = () => {
  const [dietPlan, setDietPlan] = useState(null);
 

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const response = await axios.get(`/api/diet-plans/${studentId}`);
        setDietPlan(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch diet plan');
      }
    };

    fetchDietPlan();
  }, [studentId]);

  if (!dietPlan) {
    return <p>Loading diet plan...</p>;
  }

  return (
    <div>
      <h2>My Diet Plan</h2>
      {dietPlan.meals.map((meal, index) => (
        <div key={index}>
          <h4>{meal.time}</h4>
          <p>{meal.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewDietPlan;
