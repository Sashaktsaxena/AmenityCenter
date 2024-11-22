

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function SellerPage() {
//     const [items, setItems] = useState([]);

//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3002/seller/items', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setItems(response.data);
//             } catch (error) {
//                 console.error("Error fetching seller items:", error);
//             }
//         };

//         fetchItems();
//     }, []);

//     const handleSell = async (itemId) => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.patch(`http://localhost:3002/items/sell/${itemId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             window.location.href = 'http://localhost:3000/seller'
//             console.log("Item sold:", response.data);
//         } catch (error) {
//             console.error("Error selling item:", error);
//         }
//     };

//     return (
//         <div className="items-container">
//             <h1>Your Items</h1>
//             {items.length > 0 ? (
//                 items.map(item => (
//                     <div key={item.item_id} className="item">
//                         <h2>{item.name}</h2>
//                         <p>{item.description}</p>
//                         <p>Status: {item.status}</p>
//                         {item.status === 'Requested' && (
//                             <button onClick={() => handleSell(item.item_id)}>Mark as Sold</button>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No items available</p>
//             )}
//         </div>
//     );
// }

// export default SellerPage;



//currenly in use
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function SellerPage() {
//     const [items, setItems] = useState([]);
//     const [editingItem, setEditingItem] = useState(null);
//     const [editForm, setEditForm] = useState({ name: "", description: "" });

//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3002/seller/items', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setItems(response.data);
//             } catch (error) {
//                 console.error("Error fetching seller items:", error);
//             }
//         };

//         fetchItems();
//     }, []);

//     const handleSell = async (itemId) => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.patch(`http://localhost:3002/items/sell/${itemId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             window.location.href = 'http://localhost:3000/seller'
//             console.log("Item sold:", response.data);
//         } catch (error) {
//             console.error("Error selling item:", error);
//         }
//     };

//     const handleEdit = (item) => {
//         setEditingItem(item.item_id);
//         setEditForm({ name: item.name, description: item.description });
//     };

//     const handleSaveEdit = async (itemId) => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.patch(`http://localhost:3002/items/${itemId}`, editForm, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setItems(items.map(item => item.item_id === itemId ? response.data : item));
//             setEditingItem(null);
//             setEditForm({ name: "", description: "" });
//             console.log("Item updated:", response.data);
//         } catch (error) {
//             console.error("Error updating item:", error);
//         }
//     };

//     const handleDelete = async (itemId) => {
//         const token = localStorage.getItem('token');
//         try {
//             await axios.delete(`http://localhost:3002/items/${itemId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setItems(items.filter(item => item.item_id !== itemId));
//             console.log("Item deleted");
//         } catch (error) {
//             console.error("Error deleting item:", error);
//         }
//     };

//     return (
//         <div className="items-container">
//             <h1>Your Items</h1>
//             {items.length > 0 ? (
//                 items.map(item => (
//                     <div key={item.item_id} className="item">
//                         {editingItem === item.item_id ? (
//                             <div>
//                                 <input
//                                     type="text"
//                                     value={editForm.name}
//                                     onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                                 />
//                                 <textarea
//                                     value={editForm.description}
//                                     onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
//                                 />
//                                 <button onClick={() => handleSaveEdit(item.item_id)}>Save</button>
//                                 <button onClick={() => setEditingItem(null)}>Cancel</button>
//                             </div>
//                         ) : (
//                             <div>
//                                 <h2>{item.name}</h2>
//                                 <p>{item.description}</p>
//                                 <p>Status: {item.status}</p>
//                                 {item.status === 'Requested' && (
//                                     <div>
//                                     <button onClick={() => handleSell(item.item_id)}>Mark as Sold</button>
//                                     <button onClick={() => handleEdit(item)}>Edit</button>
//                                     <button onClick={() => handleDelete(item.item_id)}>Delete</button>
//                                     </div>
//                                 )}

//                             </div>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No items available</p>
//             )}
//         </div>
//     );
// }

// export default SellerPage;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';
function SellerPage() {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", description: "", price: "", photo: null });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/seller/items', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching seller items:", error);
            }
        };

        fetchItems();
    }, []);

    const handleSell = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.patch(`http://localhost:3002/items/sell/${itemId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            window.location.href = 'http://localhost:3000/seller';
            console.log("Item sold:", response.data);
        } catch (error) {
            console.error("Error selling item:", error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item.item_id);
        setEditForm({ name: item.name, description: item.description, price: item.price, photo: item.photo });
    };

    const handleFileChange = (event) => {
        setEditForm({ ...editForm, photo: event.target.files[0] });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleSaveEdit = async (itemId) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('description', editForm.description);
        formData.append('price', editForm.price);
        if (editForm.photo) {
            formData.append('photo', editForm.photo);
        }

        try {
            const response = await axios.patch(`http://localhost:3002/items/${itemId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setItems(items.map(item => item.item_id === itemId ? response.data : item));
            setEditingItem(null);
            setEditForm({ name: "", description: "", price: "", photo: null });
            console.log("Item updated:", response.data);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const handleDelete = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3002/items/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setItems(items.filter(item => item.item_id !== itemId));
            console.log("Item deleted");
        } catch (error) {
            console.error("Error deleting item:", error);
        }
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
            <h1>Your Items</h1>
            {items.length > 0 ? (
                items.map(item => (
                    <div key={item.item_id} className="itemsell">
                        {editingItem === item.item_id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={editForm.price}
                                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                />
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <button onClick={() => handleSaveEdit(item.item_id)}>Save</button>
                                <button onClick={() => setEditingItem(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div className="k">
                            <h2>{item.name}</h2>
                            <div className="itemsell">
                            
                                {item.photo &&(<div className="imag"><img src={`data:image/jpeg;base64,${item.photo}`} alt={item.name} className="itemphoto"/></div> )}
                                <div>
                                
                                <p>{item.description}</p>
                                <p>Price: {item.price}</p>
                                
                                <p>Status: {item.status}</p>
                                {item.status === 'Requested' && (
                                    <div>
                                        
                                        <button onClick={() => handleSell(item.item_id)}>Request for payment</button>
                                        <button onClick={() => handleDelete(item.item_id)}>Delete</button>
                                    </div>
                                )}
                                {item.status==='For Sale'&&(
                                    <div>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.item_id)}>Delete</button>
                                </div>
                                )}
                                </div>

                            </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No items available</p>
            )}
        </div>
        </div>
    );
}

export default SellerPage;
