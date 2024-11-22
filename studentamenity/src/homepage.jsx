import React from 'react';

import Navbar from './nav';
import Middle from './middle';
import Banner from './banner';
import Footer from './footer';

function HomePage(){
    return (
        <div className='home'>
   
        <Navbar/>
        <Middle/>
        <Banner/>
     
        <Footer/>
        </div>

    )
}
export default HomePage;
