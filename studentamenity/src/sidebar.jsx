  // src/Sidebar.js

  import React from 'react';
  import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
  import { Home, Dashboard, Settings, ShoppingCart, FitnessCenter, LocalHospital, Report, Close } from '@mui/icons-material';
  import { Link } from 'react-router-dom';

  const Sidebar = ({ isOpen, handleClose }) => {
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
          <ListItem button component={Link} to="/profile">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button component={Link} to="/buy">
            <ListItemIcon>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="Buy" />
          </ListItem>
          <ListItem button component={Link} to="/sell">
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Sell" />
          </ListItem>
          <ListItem button component={Link} to="/gym">
            <ListItemIcon>
              <FitnessCenter />
            </ListItemIcon>
            <ListItemText primary="Gym" />
          </ListItem>
          <ListItem button component={Link} to="/medical">
            <ListItemIcon>
              <LocalHospital />
            </ListItemIcon>
            <ListItemText primary="Medical" />
          </ListItem>
          <ListItem button component={Link} to="/seller">
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Sellpage" />
          </ListItem>
          <ListItem button component={Link} to="/stureport">
            <ListItemIcon>
              <Report />
            </ListItemIcon>
            <ListItemText primary="Report" />
            
          </ListItem>
          <ListItem button component={Link} to="/signup">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Signup" />
          </ListItem>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/cart">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItem>
          <ListItem button component={Link} to="/bill">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Bills" />
          </ListItem>
        </List>
      </Drawer>
    );
  };

  export default Sidebar;
