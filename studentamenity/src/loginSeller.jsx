


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
import { faIdCard, faLock } from '@fortawesome/free-solid-svg-icons';

function LoginStud({ setRotate }) {
    const [formdata, setdata] = useState({
        Id: '',
        Passw: ''
    });
    const [isFocused, setIsFocused] = useState(false);
    const [iserror, setiserror] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3002/getlogin', formdata);
            console.log("Response from backend ", response.data);
            const statusCode = response.status;
    
            if (statusCode === 200) {
                console.log("Login successful");
                localStorage.setItem('token', response.data.token);
                if (response.data.isAdmin) {
                    window.location.href = 'http://localhost:3000/admin';
                } else {
                    const profileResponse = await axios.get('http://localhost:3002/profile', {
                        headers: {
                            Authorization: `Bearer ${response.data.token}`
                        }
                    });

                    window.location.href = 'http://localhost:3000/profile';
                }
            } else if (statusCode === 401) {
                console.log("Invalid credentials");
                setiserror('Invalid credentials');
            } else {
                console.log("Internal error");
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.status === 401) {
                console.log("Invalid credentials");
                setiserror('Invalid credentials');
            } else {
                console.log("Other error occurred");
            }
        }
    }
    
    const HandleEvent = (event) => {
        const { name, value } = event.target;
        setdata({...formdata, [name]: value});
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };
    
    return (
        <div className="back">
            <div className="outer">
                <div className="innerleft">
                    <div className="image"></div>
                </div>
                <div className="innerright">
                    <div className="head"><h1>Student Login</h1></div>
                    <div><h4>Enter the details below</h4></div>
                    {iserror && <div className="error">{iserror}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                            <FontAwesomeIcon icon={faIdCard} className="icon" />
                            <input type="text" placeholder="Enter StudentId" name="Id" value={formdata.Id} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                        <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                            <FontAwesomeIcon icon={faLock} className="icon" />
                            <input type="password" placeholder="Enter Password" name="Passw" value={formdata.Passw} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                        <div className="submit-container">
                            <input type="submit" className="submit-button" />
                        </div>
                    </form>
                    <Link to="#" onClick={() => setRotate(false)}><a>Create a new account</a></Link>
                    <Link to='/reset'>Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginStud;


