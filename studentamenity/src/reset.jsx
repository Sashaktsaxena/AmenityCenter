import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faLock ,faKey} from '@fortawesome/free-solid-svg-icons';


function Reset() {
    const [formdata, setdata] = useState({
        secret: '',
        Passw: '',
        Updpassw: ''
    });
    const [isFocused, setIsFocused] = useState(false);
    const [isError, setIsError] = useState('');

    const HandleEvent = (event) => {
        const { name, value } = event.target;
        setdata({ ...formdata, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Assuming you have the token stored
            const response = await axios.patch(`http://localhost:3002/forget`, {
                id:formdata.st_id,
                secret: formdata.secret,
                newPassword: formdata.Updpassw
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Password updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating password:", error);
            setIsError('Failed to update password. Please check your details and try again.');
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className="innerright">
        <div><h2>Reset Password</h2></div>
            <form onSubmit={handleSubmit}>
            <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                    <FontAwesomeIcon icon={faKey} className="icon" />
                    <input
                        type="text"
                        placeholder="Enter your Student Id"
                        name="st_id"
                        value={formdata.st_id}
                        onChange={HandleEvent}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>
                <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                    <FontAwesomeIcon icon={faKey} className="icon" />
                    <input
                        type="text"
                        placeholder="Enter your childhood nickname"
                        name="secret"
                        value={formdata.secret}
                        onChange={HandleEvent}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>

                <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                    <FontAwesomeIcon icon={faLock} className="icon" />
                    <input
                        type="password"
                        placeholder="Enter new password"
                        name="Passw"
                        value={formdata.Passw}
                        onChange={HandleEvent}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>
                <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                    <FontAwesomeIcon icon={faLock} className="icon" />
                    <input
                        type="password"
                        placeholder="Retype new password"
                        name="Updpassw"
                        value={formdata.Updpassw}
                        onChange={HandleEvent}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>
                {isError && <p className="error-message">{isError}</p>}
                <div className="submit-container">
                    <input type="submit" className="submit-button" />
                </div>
            </form>
        </div>
    );
}

export default Reset;

// function reset(){
//     const [formdata, setdata] = useState({
//         secret:'',
//         Passw: '',
//         Updpassw:''
        
//     });
//     const [isFocused, setIsFocused] = useState(false);
//     const [iserror, setiserror] = useState('');
//     const HandleEvent = (event) => {
//         const { name, value } = event.target;
//         setdata({ ...formdata, [name]: value });
//     };
//     const handleSubmit=async(event)=>{
//         event.preventDefault();
//         try{
//             const respomse=await axios.patch()

//         }catch(error){

//         }
//     }

//     const handleFocus = () => {
//         setIsFocused(true);
//     };

//     const handleBlur = () => {
//         setIsFocused(false);
//     };

//     return(
//         <div>
//             <div>
//                 <form onSubmit={handleSubmit}>

//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faKey} className="icon" />
//                         <input type="text" placeholder="Enter your childhood nick name" name="secret" value={formdata.secret} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faLock} className="icon" />
//                         <input type="password" placeholder="Enter password" name="Passw" value={formdata.Passw} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faLock} className="icon" />
//                         <input type="password" placeholder="Enter Updated password" name="Updpassw" value={formdata.Passw} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className="submit-container">
//                         <input type='submit' className="submit-button"  />
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }