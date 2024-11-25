


// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faIdCard, faLock } from '@fortawesome/free-solid-svg-icons';

// function LoginStud() {
//     const [userProfile, setUserProfile] = useState(null);
//     const [formdata, setdata] = useState({
//         Id: '',
//         Passw: ''
//     });
//     const [isFocused, setIsFocused] = useState(false);
//     const [iserror, setiserror] = useState('');

//     async function handleSubmit(event) {
//         event.preventDefault();
        
//         try {
//             const response = await axios.post('http://localhost:3002/getlogin', formdata);
//             console.log("Response from backend ", response.data);
//             const statusCode = response.status;
    
//             if (statusCode === 200) {
//                 console.log("Login successful");
//                 localStorage.setItem('token', response.data.token);
//                 if (response.data.isAdmin) {
//                     window.location.href = 'http://localhost:3000/admin';
//                 }else{
//                 // Fetch user profile information after successful login
//                 const profileResponse = await axios.get('http://localhost:3002/profile', {
//                     headers: {
//                         Authorization: `Bearer ${response.data.token}`
//                     }
//                 });

//                 setUserProfile(profileResponse.data); // Set user profile state
//                 window.location.href = 'http://localhost:3000/profile';
//             }
//             } else if (statusCode === 401) {
//                 console.log("Invalid credentials");
//                 setiserror('Invalid credentials');
//             } else {
//                 console.log("Internal error");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             if (error.response && error.response.status === 401) {
//                 console.log("Invalid credentials");
//                 setiserror('Invalid credentials');
//             } else {
//                 console.log("Other error occurred");
//                 // Handle other errors
//             }
//         }
//     }
    
//     const HandleEvent = (event) => {
//         const { name, value } = event.target;
//         setdata({...formdata, [name]: value});
//     };

//     const handleFocus = () => {
//         setIsFocused(true);
//     };

//     const handleBlur = () => {
//         setIsFocused(false);
//     };
    
//     return (
//         <div className="outer">
//             <div className="innerleft">
//                 <div className="image"></div>
//             </div>
//             <div className="innerright">
//                 <div className="head"><h1>Student Login Form</h1></div>
//                 <div><h4>Enter the details below</h4></div>
//                 {iserror && <div className="error">{iserror}</div>}
//                 <form onSubmit={handleSubmit}>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faIdCard} className="icon" />
//                         <input type="number" placeholder="Enter StudentId" name="Id" value={formdata.Id} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faLock} className="icon" />
//                         <input type="password" placeholder="Enter password" name="Passw" value={formdata.Passw} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className="submit-container">
//                         <input type='submit' className="submit-button"  />
//                     </div>
//                 </form>
//                 <Link to={'/signup'}><a>Create a new account</a></Link>
//                 <Link to={'/reset'}><a>Forget password?</a></Link>
//             </div>
//         </div>
//     );
// }

// export default LoginStud; 

import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function LoginStud({ setRotate }) {
    const [formdata, setFormData] = useState({
        email: '',
        Id: '',
        Passw: '',
    });
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isError, setIsError] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formdata, [name]: value });
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3002/getlogin', {
            Id: formdata.Id,
            Passw: formdata.Passw,
            email: formdata.email,
          });
      
          console.log(response.data.message);
          setIsOtpSent(true);
        } catch (error) {
          console.error('Error verifying credentials or sending OTP:', error);
          setIsError(error.response?.data?.message || 'Something went wrong');
        }
      };
      

      const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3002/verify-otp', {
                email: formdata.email,
                otp,
                Id: formdata.Id,
                Passw: formdata.Passw,
            });
            console.log(response.data);
    
            if (response.status === 200) {
                console.log("Login successful");
                localStorage.setItem('token', response.data.token);
    
                // Check if user is an admin
                if (response.data.isAdmin) {
                    window.location.href = 'http://localhost:3000/admin';
                } else {
                    // If the user is not an admin, redirect to their profile
                    const profileResponse = await axios.get('http://localhost:3002/profile', {
                        headers: {
                            Authorization: `Bearer ${response.data.token}`
                        }
                    });
    
                    // Optionally, handle profile data if needed
                    console.log(profileResponse.data);
                    window.location.href = 'http://localhost:3000/profile';
                }
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setIsError('Invalid or expired OTP. Please try again.');
        }
    };
    
    return (
        <div className="back">
            <div className="outer">
                <div className="innerright">
                    <h1>Student Login</h1>
                    {isError && <div className="error">{isError}</div>}

                    {!isOtpSent ? (
                        <form onSubmit={handleSendOtp}>
                            <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={formdata.email}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                                <FontAwesomeIcon icon={faIdCard} className="icon" />
                                <input
                                    type="text"
                                    name="Id"
                                    placeholder="Enter Student ID"
                                    value={formdata.Id}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                                <FontAwesomeIcon icon={faLock} className="icon" />
                                <input
                                    type="password"
                                    name="Passw"
                                    placeholder="Enter Password"
                                    value={formdata.Passw}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                Send OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                Verify OTP
                            </button>
                        </form>
                    )}
                    <Link to="#" onClick={() => setRotate(false)}>Create a new account</Link>
                    <Link to="/reset">Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginStud;
