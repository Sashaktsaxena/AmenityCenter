// // import { Buffer } from 'buffer';
// // window.Buffer = Buffer;
// // import process from 'process';
// // window.process = process;

// import React from 'react';
// import ReactDOM from 'react-dom';
// import "./App.css";
// import LoginStud from './loginSeller'; // Corrected component name
// import Reset from './reset';
// // import {
// //   createBrowserRouter,
// //   RouterProvider,
// // } from "react-router-dom";
// import SignStud from './loginStud';



// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import UserProfile from './profile';
// import BuyItems from './buy';
// import SellItem from './sell';
// import { Buffer } from 'buffer';
// import process from 'process';

// window.Buffer = Buffer;
// window.process = process;

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<SignStud />} />
//         <Route path="/login" element={<LoginStud />} />
//         <Route path='/profile' element={<UserProfile/>}/>
//         <Route path='/reset' element={<Reset/>}/>
//         <Route path='/buy' element={<BuyItems/>}/>
//         <Route path='/sell' element={<SellItem/>}/> 
//       </Routes>
//     </Router>
//   );
// };

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );


// // const router = createBrowserRouter([
// //   {
// //     path: "/",
// //     element: <SignStud />,
// //   },
// //   {
// //     path: "/login",
// //     element: <LoginStud />,
// //   },
  
// // ]);
// // const root = document.getElementById("root");

// // ReactDOM.render(
// //   <React.StrictMode>
// //     <RouterProvider router={router}/>
// //   </React.StrictMode>,
// //   root
// // );
import React from 'react';
import ReactDOM from 'react-dom';
import "./App.css";
import SignStud from './loginStud';
import LoginStud from './loginSeller'; // Ensure this is the correct component name
import Reset from './reset';
import UserProfile from './profile';
import BuyItems from './buy';
import SellItem from './sell';
import SellerPage from './sellerpage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Buffer } from 'buffer';
import process from 'process';
import GymPage from './gym';
import CreateAppointment from './medical';
import CartPage from './cart';
import StudentManagement from './studentadmin';
import ItemManagement from './itemadmin';
import DoctorManagement from './doctoradmin';
import AdminPage from './admin';
import UserReportPage from './clientreport';
import AdminReportsPage from './adminreport';
import HomePage from './homepage';
import FormMain from './rotate';
import PaymentPage from './payment';
import BillPage from './bill';

// Set Buffer and process globally
window.Buffer = Buffer;
window.process = process;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<FormMain/>} />
        <Route path="/login" element={<FormMain/>} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/reset' element={<Reset />} />
        <Route path='/buy' element={<BuyItems />} />
        <Route path='/seller' element={<SellerPage />} /> 
        <Route path='/gym' element={<GymPage/>} />
        <Route path='/medical' element={<CreateAppointment/>} />
        <Route path='/cart' element={<CartPage/>} />
        <Route path='/sell' element={<SellItem/>} />
        <Route path='/studentadmin' element={<StudentManagement/>} />
        <Route path='/itemadmin' element={<ItemManagement/>} />
        <Route path='/doctoradmin' element={<DoctorManagement/>} />
        <Route path='/admin' element={<AdminPage/>} />
        <Route path='/stureport' element={<UserReportPage/>} />
        <Route path='/adreport' element={<AdminReportsPage/>} />
        <Route path="/payment/:itemId" element={<PaymentPage />} />
        <Route path="/bill" element={<BillPage />} />


    

      </Routes>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
