import React, { useState } from 'react';
import axios from 'axios';
import Sidebarad from './sidebarad';
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
const DoctorManagement = () => {
  const [doctorId, setDoctorId] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [availabilityTime, setAvailabilityTime] = useState('');

  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialization, setNewDoctorSpecialization] = useState('');
  const [newDoctorAvailabilityStart, setNewDoctorAvailabilityStart] = useState('');
  const [newDoctorAvailabilityEnd, setNewDoctorAvailabilityEnd] = useState('');
  const [newDoctorAvailabilityTime, setNewDoctorAvailabilityTime] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
  };
  const handleUpdateAvailability = async () => {
    try {
      await axios.patch(`http://localhost:3002/api/doctors/${doctorId}`, { availabilityStart, availabilityEnd, availabilityTime });
      alert('Availability updated successfully');
    } catch (error) {
        console.log("odhks")
      console.error('Error updating availability:', error);
    }
  };

  const handleAddDoctor = async () => {
    try {
      await axios.post('http://localhost:3002/api/doctors', {
        name: newDoctorName,
        specialization: newDoctorSpecialization,
        availabilityStart: newDoctorAvailabilityStart,
        availabilityEnd: newDoctorAvailabilityEnd,
        availabilityTime: newDoctorAvailabilityTime
      });
      alert('Doctor added successfully');
      // Clear the form fields after submission
      setNewDoctorName('');
      setNewDoctorSpecialization('');
      setNewDoctorAvailabilityStart('');
      setNewDoctorAvailabilityEnd('');
      setNewDoctorAvailabilityTime('');
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <div>
                <CssBaseline />
            <Sidebarad isOpen={sidebarOpen} handleClose={toggleSidebar} />
            {/* <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: ' rgb(183, 231, 124)', p: 3,position:'relative',justifyContent:'center' }}
            > */}
       
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleSidebar}
                    edge="start"
                    sx={{ position: 'absolute', top: 18, left: 10 }}
                >
                    <MenuIcon />
                </IconButton>
      <h3>Doctor Management</h3>
      <div>
        <h4>Update Doctor Availability</h4>
        <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="Doctor ID" />
        <input type="date" value={availabilityStart} onChange={(e) => setAvailabilityStart(e.target.value)} placeholder="Availability Start" />
        <input type="date" value={availabilityEnd} onChange={(e) => setAvailabilityEnd(e.target.value)} placeholder="Availability End" />
        <input type="time" value={availabilityTime} onChange={(e) => setAvailabilityTime(e.target.value)} placeholder="Availability Time" />
        <button onClick={handleUpdateAvailability}>Update Availability</button>
      </div>
      <div>
        <h4>Add New Doctor</h4>
        <input type="text" value={newDoctorName} onChange={(e) => setNewDoctorName(e.target.value)} placeholder="Doctor Name" />
        <input type="text" value={newDoctorSpecialization} onChange={(e) => setNewDoctorSpecialization(e.target.value)} placeholder="Specialization" />
        <input type="date" value={newDoctorAvailabilityStart} onChange={(e) => setNewDoctorAvailabilityStart(e.target.value)} placeholder="Availability Start" />
        <input type="date" value={newDoctorAvailabilityEnd} onChange={(e) => setNewDoctorAvailabilityEnd(e.target.value)} placeholder="Availability End" />
        <input type="time" value={newDoctorAvailabilityTime} onChange={(e) => setNewDoctorAvailabilityTime(e.target.value)} placeholder="Availability Time" />
        <button onClick={handleAddDoctor}>Add Doctor</button>
      </div>
    </div>
  );
};

export default DoctorManagement;
