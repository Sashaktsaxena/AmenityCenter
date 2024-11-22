
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { CssBaseline, Box, Typography } from '@mui/material';
// import Sidebar from './sidebar';
// function Profile() {
//     const [userProfile, setUserProfile] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3002/profile', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setUserProfile(response.data);

//             } catch (error) {
//                 console.error("Error:", error);
//                 // Handle error
//             }
//         };

//         fetchData();

//     }, []);

//     return (
//         <Box sx={{ display: 'flex' }}>
//             <CssBaseline />
//             <Sidebar />
//             <Box
//                 component="main"
//                 sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
//             >
//         <div className="profile-container">
//             {userProfile ? (
//                 <div className="profile-info">
//                     <h1>Welcome to the Student Amenity Center<br></br> {userProfile.name}</h1>
//                     <div className="profile-detail">
//                         {userProfile.photo && (
//                             <img
//                                 src={`data:image/jpeg;base64,${userProfile.photo}`}
//                                 alt="Profile"
//                                 className="profile-photo"
//                             />
//                         )}
//                     </div>
//                     <div className="profile-detail">
//                         <strong>Name:</strong> {userProfile.name}
//                     </div>
//                     <div className="profile-detail">
//                         <strong>Student ID:</strong> {userProfile.st_id}
//                     </div>
//                     <div className="profile-detail">
//                         <strong>Contact:</strong> {userProfile.contact}
//                     </div>
//                     <div className="profile-detail">
//                         <strong>Course:</strong> {userProfile.course}
//                     </div>
//                     <Link to={'/buy'}><a>Buy</a></Link>
//                     <Link to={'/sell'}><a>Sell</a></Link>
//                     <Link to={'/gym'}><a>Gym</a></Link>
//                     <Link to={'/medical'}><a>Medical</a></Link>
//                     <Link to={'/seller'}><a>Sellpage</a></Link>
//                     <Link to={'/stureport'}><a>Report</a></Link>
//                 </div>
//             ) : (
//                 <p>Loading...</p>
//             )}
//         </div>
//         </Box>
//         </Box>
//     );
// }
// export default Profile;



// src/Profile.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';
import "./login.css"
import Navbar from "./nav";

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserProfile(response.data);

            } catch (error) {
                console.error("Error:", error);
                // Handle error
            }
        };

        fetchData();

    }, []);
    function Redirectlog(){
        window.location.href = 'http://localhost:3000/login';
    }
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
                
                <div className="profile-container">
                
                    {userProfile ? (
                        <div className="profile-info">
                            <h1>Welcome to the Student Amenity Center<br /> {userProfile.name}</h1>
                            <div className="profile-detail">
                                {userProfile.photo && (
                                    <img
                                        src={`data:image/jpeg;base64,${userProfile.photo}`}
                                        alt="Profile"
                                        className="profile-photo"
                                    />
                                )}
                            </div>

                            <div className="profile-detail">
                                <strong>Name:</strong> {userProfile.name}
                            </div>
                            <div className="profile-detail">
                                <strong>Student ID:</strong> {userProfile.st_id}
                            </div>
                            <div className="profile-detail">
                                <strong>Contact:</strong> {userProfile.contact}
                            </div>
                            <div className="profile-detail">
                                <strong>Course:</strong> {userProfile.course}
                            </div>

                            
                        </div>
                    ) : (
                        <div onClick={Redirectlog}>
                        <p>Loading...</p>
                        </div>
                    )}
                </div>
            {/* </Box>
        </Box> */}
        </div>
    );
}

export default Profile;
