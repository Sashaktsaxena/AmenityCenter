import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import GymPaymentPage from './gympay';
import GymWelcomePage from './gymMember';
const GymPage = () => {
    const [showPaymentPage, setShowPaymentPage] = useState(true);
    const [membership, setMembership] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchGymDetails = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:3002/gym/details', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setShowPaymentPage(response.data.showPaymentPage);
          if (!response.data.showPaymentPage) {
            setMembership(response.data.membership);
          }
        } catch (error) {
          console.error('Error fetching gym details:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchGymDetails();
    }, []);
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    return showPaymentPage ? <GymPaymentPage /> : <GymWelcomePage membership={membership} />;
  };
export default GymPage;