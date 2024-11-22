import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { CssBaseline, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';

const GymPaymentPage = () => {
  const [gymTime, setGymTime] = useState('');
  const [monthPaid, setMonthPaid] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [message, setMessage] = useState('');
  const [month, setMonth] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const t = new Date().getMonth();
    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];
    setMonth(monthNames[t]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(token);
    
    // Validate expiry date
    const currentDate = new Date();
    const [expMonth, expYear] = expiryDate.split('/').map(val => parseInt(val));
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      setMessage("Expiry date must be greater than the current date.");
      return;
    }

    try {
      // Sending only gymTime, monthPaid, and amount to the backend
      const response = await axios.post(
        'http://localhost:3002/gym/register',
        { gymTime, monthPaid, amount: 300 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      window.location.reload();
    } catch (error) {
      setMessage(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div>
      <CssBaseline />
      <Sidebar isOpen={sidebarOpen} handleClose={toggleSidebar} />

      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleSidebar}
        edge="start"
        sx={{ position: 'absolute', top: 18, left: 10 }}
      >
        <MenuIcon />
      </IconButton>

      <div className="gym-form-container">
        <h2 className="gym-form-title">Gym Registration and Payment</h2>
        <p className="gym-form-subtitle">Enter the details below</p>
        <form className="gym-form" onSubmit={handleSubmit}>
          {/* Gym Time Selection */}
          <div className="gym-form-group">
            <select value={gymTime} onChange={(e) => setGymTime(e.target.value)} className="gym-form-input" required>
              <option value="">Select Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>

          {/* Month Selection */}
          <div className="gym-form-group">
            <select value={monthPaid} onChange={(e) => setMonthPaid(e.target.value)} className="gym-form-input" required>
              <option value="">Select Month</option>
              <option value={month}>{month}</option>
            </select>
          </div>

          {/* Cardholder Name */}
          <div className="gym-form-group">
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value.toUpperCase())} // Make uppercase
              placeholder="Cardholder Name"
              className="gym-form-input"
              required
            />
          </div>

          {/* Card Number */}
          <div className="gym-form-group">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                if (value.length <= 16) {
                  setCardNumber(value);
                }
              }}
              placeholder="Card Number"
              className="gym-form-input"
              maxLength="16"
              required
            />
          </div>

          {/* CVV */}
          <div className="gym-form-group">
            <input
              type="password"
              value={cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                if (value.length <= 3) {
                  setCvv(value);
                }
              }}
              placeholder="CVV"
              className="gym-form-input"
              maxLength="3"
              required
            />
          </div>

          {/* Expiry Date */}
          <div className="gym-form-group">
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="Expiry Date (MM/YY)"
              className="gym-form-input"
              required
            />
          </div>

          <button type="submit" className="gym-form-submit">Pay ₹300</button>
        </form>
        {message && <p className="gym-form-message">{message}</p>}
      </div>
    </div>
  );
};

export default GymPaymentPage;
