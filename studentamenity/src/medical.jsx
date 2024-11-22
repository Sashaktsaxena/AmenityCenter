


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';
const CreateAppointment = () => {
  const [doctorType, setDoctorType] = useState('');
  const [description, setDescription] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [doctorTypes, setDoctorTypes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorAvailabilities, setDoctorAvailabilities] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchDoctorTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/doctor-types');
        setDoctorTypes(response.data);
      } catch (error) {
        console.error('Error fetching doctor types:', error);
        setError('Failed to load doctor types');
      }
    };

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3002/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
      }
    };

    const fetchDoctorAvailabilities = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/doctor-availabilities');
        setDoctorAvailabilities(response.data);
      } catch (error) {
        console.error('Error fetching doctor availabilities:', error);
        setError('Failed to load doctor availabilities');
      }
    };

    fetchDoctorTypes();
    fetchAppointments();
    fetchDoctorAvailabilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:3002/appointments', {
        doctorType,
        description,
        appointmentDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAppointment(response.data.appointment);
      setAppointments([...appointments, response.data.appointment]);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3002/api/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAppointments(appointments.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setError('Failed to cancel appointment');
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
    <div className="container">
      <h2>Create Appointment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className='med'>
        <label className="m">
          Doctor Type:
          <select value={doctorType} onChange={(e) => setDoctorType(e.target.value)}  className='s' required>
            <option value="">Select a doctor type</option>
            {doctorTypes.map((type) => (
              <option key={type.id} value={type.type}>
                {type.type}
              </option>
            ))}
          </select>
        </label>
        <label className="m">
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}  className='t'  required />
        </label>
        <label className="m">
          Appointment Date:
          <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className='i' required />
        </label>
        <button type="submit">Book Appointment</button>
      </form>

      <h2>Doctor Availability</h2>
      {doctorAvailabilities.length > 0 ? (
        <table className="tablee">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialty</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Available Time</th>
             
            </tr>
          </thead>
          <tbody>
            {doctorAvailabilities.map((availability) => (
              <tr key={availability.id}>
                <td>{availability.name}</td>
                <td>{availability.type}</td>
                <td>{availability.availability_start_date}</td>
                <td>{availability.availability_end_date}</td>
                <td>{availability.availability_time}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No doctor availability found</p>
      )}

      <hr />

      <h2>Your Appointments</h2>
      <div className="appointments">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="appointment">
              <p>Doctor Type: {appointment.dtype}</p>
              <p>Description: {appointment.description}</p>
              <p>Appointment Date: {appointment.appointment_date}</p>
              <p>Doctor id: {appointment.doctor_id}</p>
              <p>Doctor Name: {appointment.dname}</p>
              <p>Status:{appointment.status}</p>
              {appointment.status === 'Scheduled' && (
                <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel Appointment</button>
              )}
            </div>
          ))
        ) : (
          <p>No appointments found</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default CreateAppointment;
