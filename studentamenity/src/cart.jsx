// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function CartPage() {
//     const [items, setItems] = useState([]);

//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3002/cart', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setItems(response.data);
//             } catch (error) {
//                 console.error("Error fetching cart items:", error);
//             }
//         };

//         fetchItems();
//     }, []);

//     return (
//         <div className="cart-container">
//             <h1>Your Cart</h1>
//             {items.length > 0 ? (
//                 items.map(item => (
//                     <div key={item.item_id} className="item">
//                         <h2>{item.name}</h2>
//                         <p>{item.description}</p>
//                         <p>Item buyed in :{item.price}</p>
//                         <p>Seller Contact: {item.seller_contact}</p>
//                         <p>Item Status :{item.status}</p>
//                         {item.photo &&(<img src={`data:image/jpeg;base64,${item.photo}`} alt={item.name} className="profile-photos"/> )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No items in cart</p>
//             )}
//         </div>
//     );
// }

// export default CartPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CssBaseline, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';

function CartPage() {
    const [items, setItems] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchItems();
    }, []);

    const proceedToPayment = (itemId) => {
        // Navigate to the payment page with the item ID
        navigate(`/payment/${itemId}`);
    };

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

            <div className="seller">
                <h1>Your Cart</h1>
                {items.length > 0 ? (
                    items.map(item => (
                        <div className="k" key={item.item_id}>
                            <h2>{item.name}</h2>
                            <div className="itemsell">
                                {item.photo && (
                                    <div className="imag">
                                        <img
                                            src={`data:image/jpeg;base64,${item.photo}`}
                                            alt={item.name}
                                            className="itemphoto"
                                        />
                                    </div>
                                )}
                                <div className="item">
                                    <p>{item.description}</p>
                                    <p>Price: {item.price}</p>
                                    <p>Seller Contact: {item.seller_contact}</p>
                                    <p>Status: {item.status}</p>

                                    {/* Conditionally render the Proceed to Payment button */}
                                    {item.status === 'PP' && (
                                        <button
                                            onClick={() => proceedToPayment(item.item_id)}
                                            className="payment-button"
                                        >
                                            Proceed to Payment
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items in cart</p>
                )}
            </div>
        </div>
    );
}

export default CartPage;

