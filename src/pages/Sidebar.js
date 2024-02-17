import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const Sidebar = ({ isLoggedIn, onLogout }) => {
  return (
    <Drawer
      variant="permanent"
      className='side-menu'
      sx={{
        width: 200,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 200,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        <ListItemButton component={Link} to="/home">
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/charts">
          <ListItemText primary="Charts" />
        </ListItemButton>
        {isLoggedIn && (
          <ListItemButton onClick={onLogout} component={Link} to="/">
            <ListItemText primary="Logout" />
          </ListItemButton>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
