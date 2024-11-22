import React, { useState } from "react"
import axios from "axios"
import { Link } from 'react-router-dom';
function signSeller(){
    const [formdata,setdata]=useState({
        name:'',
        SellerId:'',
        Contact:'',
        Password:'',

    })
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            // Make POST request to backend API
            const response = await axios.post('http://localhost:3002/getinfo', formdata);
            console.log("Response from backend:", response.data);
            // Optionally, do something with the response
        } catch (error) {
            console.error("Error:", error);
            // Handle errors
        }
    };
    const HandleEvent=(event)=>{
        const {name,value}=event.target;
        setdata({...formdata,[name]:value})
    }
    return (
        <div className="outer">
            <div className="inner">
                <div className="head"><h3>Seller Registeration Form</h3></div>
                <div className="info">
                <form onSubmit={handleSubmit}>
                <label>SellerID:
                    <input type="number" placeholder="SellerId" name="SellerId" value={formdata.SellerId} onChange={HandleEvent}/>
                </label>
                <label>Name:
                <input type="text" placeholder="name" name="name" value={formdata.name} onChange={HandleEvent}/>
                </label>
                <label>Contact:
                    <input type="number" placeholder="Phone no." name="Contact" value={formdata.Contact} onChange={HandleEvent}/>
                </label>
                <label>Password:
                    <input type="password" placeholder name="Password" value={formdata.Password} onChange={HandleEvent}/>
                </label>
                <label>
                    <input type='submit'/>
                </label>
                </form>
               
                </div>
            </div>
        </div>
    )
}
export default signSeller;