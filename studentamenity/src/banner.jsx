import React from "react";
import { Link } from "react-router-dom";
function Banner(){
    return (
      

<section>

<div className="we">
<h1 className="no">Functionality</h1>
<div className="big_div">
        
        <Link to='/login'><div className="gym"></div></Link>
        <Link to='/Login'><div className="medicine"></div></Link>
        <Link to='/login'><div className="buying"></div></Link>
        <Link to='/login'><div className="selling"></div></Link>
    </div>
<div  className="ban">
<p >
"Amenity Center offers comprehensive services including gym registrations, medical appointment scheduling, and a marketplace for buying and selling products. The platform provides a seamless user experience, integrating various essential services into one convenient website for easy access and management"</p></div>

</div>
    </section>
    )
}
export default Banner;