// src/Sidebar.js

import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Home, Dashboard, Settings, ShoppingCart, FitnessCenter, LocalHospital, Report, Close,LoginIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebarad = ({ isOpen, handleClose }) => {
  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <IconButton onClick={handleClose}>
        <Close />
      </IconButton>
      <List>
      <ListItem button component={Link} to="/admin">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button component={Link} to="/studentadmin">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="StudentManagemet" />
        </ListItem>
        <ListItem button component={Link} to="/itemadmin">
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Itemmanagement" />
        </ListItem>
        <ListItem button component={Link} to="/doctoradmin">
          <ListItemIcon>
          <LocalHospital />
          </ListItemIcon>
          <ListItemText primary="DoctorManagement" />
        </ListItem>
        <ListItem button component={Link} to="/adreport">
          <ListItemIcon>
            <Report />
          </ListItemIcon>
          <ListItemText primary="Report" />
        </ListItem>
        <ListItem button component={Link} to="/signup">
          <ListItemIcon>
            <Settings/>
          </ListItemIcon>
          <ListItemText primary="Signup" />
        </ListItem>

      </List>
    </Drawer>
  );
};

export default Sidebarad;
