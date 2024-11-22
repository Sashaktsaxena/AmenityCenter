import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, CssBaseline, Grid } from "@mui/material";
import dayjs from 'dayjs';

function PaymentPage() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [formData, setFormData] = useState({
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        otp: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Fetch item details on component mount
    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3002/items/${itemId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching item details:", error);
            }
        };

        fetchItemDetails();
    }, [itemId]);

    // Handle form inputs and validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Automatically convert card holder's name to uppercase
        const updatedValue = name === "cardHolder" ? value.toUpperCase() : value;

        setFormData({ ...formData, [name]: updatedValue });
        validateInput(name, updatedValue);
    };

    // Validate form inputs
    const validateInput = (name, value) => {
        const newErrors = { ...errors };

        if (name === "cardNumber") {
            if (!/^\d{16}$/.test(value)) {
                newErrors.cardNumber = "Card number must be exactly 16 digits.";
            } else {
                delete newErrors.cardNumber;
            }
        }

        if (name === "expiryDate") {
            const currentYearMonth = dayjs().format("YYMM");
            const [month, year] = value.split('/');
            
            if (!/^\d{2}\/\d{2}$/.test(value)) {
                newErrors.expiryDate = "Expiry date must be in MM/YY format.";
            } else if (parseInt(month) < 1 || parseInt(month) > 12) {
                newErrors.expiryDate = "Invalid month.";
            } else if (`${year}${month}` < currentYearMonth) {
                newErrors.expiryDate = "Expiry date must be in the future.";
            } else {
                delete newErrors.expiryDate;
            }
        }

        if (name === "cvv") {
            if (!/^\d{3}$/.test(value)) {
                newErrors.cvv = "CVV must be exactly 3 digits.";
            } else {
                delete newErrors.cvv;
            }
        }

        setErrors(newErrors);
    };

    const handlePayment = async () => {
        if (Object.keys(errors).length > 0) {
            alert("Please fix the errors before submitting.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                alert("User not authenticated");
                return;
            }

            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.userId;

            const paymentData = {
                itemName: item.name,
                itemPrice: item.price,
                itemImage: item.photo,
            };

            const paymentResponse = await axios.post('http://localhost:3002/make-payment', paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (paymentResponse.status === 201) {
                alert("Payment successful!");

                const updateItemResponse = await axios.patch(
                    `http://localhost:3002/change/${itemId}`,
                    { buyerId: userId },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (updateItemResponse.status === 200) {
                    alert("Item marked as sold!");
                    navigate('/bill');
                }
            }
        } catch (error) {
            console.error("Error during payment:", error);
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <div>
            <CssBaseline />
            <Box sx={{ maxWidth: 900, margin: 'auto', padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Payment Page
                </Typography>
                
                {item ? (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Card Holder Name"
                                    name="cardHolder"
                                    value={formData.cardHolder}
                                    onChange={handleInputChange}
                                    required
                                    helperText={errors.cardHolder}
                                />
                                <TextField
                                    label="Card Number"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    required
                                    inputProps={{ maxLength: 16 }}
                                    error={!!errors.cardNumber}
                                    helperText={errors.cardNumber}
                                />
                                <TextField
                                    label="Expiry Date (MM/YY)"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="MM/YY"
                                    error={!!errors.expiryDate}
                                    helperText={errors.expiryDate}
                                />
                                <TextField
                                    label="CVV"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    required
                                    inputProps={{ maxLength: 3 }}
                                    error={!!errors.cvv}
                                    helperText={errors.cvv}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlePayment}
                                    sx={{ marginTop: 2 }}
                                >
                                    Pay
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ textAlign: 'center' }}>
                                {item?.photo && (
                                    <img
                                        src={`data:image/jpeg;base64,${item.photo}`}
                                        alt={item.name}
                                        style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '20px' }}
                                    />
                                )}
                                <Typography variant="h5">{item?.name}</Typography>
                                <Typography variant="body1">{item?.description}</Typography>
                                <Typography variant="h6" sx={{ marginTop: 2 }}>
                                    Total Amount: ₹{item?.price}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>Loading item details...</Typography>
                )}
            </Box>
        </div>
    );
}

export default PaymentPage;
