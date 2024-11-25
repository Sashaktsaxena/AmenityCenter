import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

const GymWelcomePage = ({ membership }) => {
  
  const [Bill, setBill] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3002/bills', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBill(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchBills();
  }, []);

    if (!membership) {
      return <p>Error: Membership data not available.</p>;
    }

    return (
      <div>
        <h2>Welcome to the Gym!</h2>
        <p>Gym Time: {membership.gym_time}</p>
        <p>Month Paid: {membership.month_paid}</p>
        <p>Enter Your Height in cm :{membership.height}</p>
        <p>Enter Your Weight in kg :{membership.weight}</p>


        <div>
          <h1>Receipts</h1>
          {Bill.length > 0 ? (
                Bill.map(item => (
                    <div key={item.membership_id} className="itemn">
                        <p>Month Paid:{item.month_paid}</p>
                        <p>Gym Time:{item.gym_time}</p>
                        <p>Name: {item.name}</p>
                        <p>Contact: {item.contact}</p>
                        <p>Amount:300/-</p>
                        <p>Paid </p>
                        <br/>
                    </div>
                ))
            ) : (
                <p>No items available</p>
            )}
        </div>
      </div>
    );
  };
export default GymWelcomePage;