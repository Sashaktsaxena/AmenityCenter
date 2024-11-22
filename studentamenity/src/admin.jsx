
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebarad from './sidebarad';
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
function AdminPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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
            <h1>Admin Page</h1>
            <p>Welcome, Admin! Manage the site here.</p>

        </div>
    );
}

export default AdminPage;
