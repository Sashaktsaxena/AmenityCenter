import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CssBaseline,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';

function BillPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch payment details when the component mounts
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3002/payments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <CssBaseline />

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} handleClose={toggleSidebar} />

      {/* Menu Icon for toggling the sidebar */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleSidebar}
        edge="start"
        sx={{ position: 'absolute', top: 18, left: 10 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: 900,
          margin: 'auto',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#ffffff',
          mt: 5,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          Billing Information
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : payments.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Payment ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price (₹)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map(payment => (
                  <TableRow
                    key={payment.id}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                      '&:hover': { backgroundColor: '#e0f7fa', cursor: 'pointer' },
                    }}
                  >
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.itemname}</TableCell>
                    <TableCell>₹{payment.itemprice}</TableCell>
                    <TableCell>{new Date(payment.paymentdate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h6" sx={{ color: 'gray' }}>
              No payment history found.
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
              Your payment history will appear here once you make a purchase.
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default BillPage;
