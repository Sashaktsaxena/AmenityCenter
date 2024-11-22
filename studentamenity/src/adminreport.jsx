import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './nav';
import Sidebarad from './sidebarad';
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
const AdminReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:3002/reports', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };
        fetchReports();
    }, []);

    const handleSelectReport = async (report) => {
        setSelectedReport(report);
        try {
            const response = await axios.get(`http://localhost:3002/reports/${report.report_id}/comments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment) return;
        try {
            const response = await axios.post(`http://localhost:3002/reports/${selectedReport.report_id}/comments`, 
            { comment: newComment }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setComments([...comments, response.data.comment]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleUpdateStatus = async (reportId, status) => {
        try {
            const response = await axios.patch(`http://localhost:3002/reports/${reportId}/status`, 
            { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReports(reports.map(report => 
                report.report_id === reportId ? response.data.report : report
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div>
            
            <CssBaseline />
            <Sidebarad isOpen={sidebarOpen} handleClose={toggleSidebar} />
            {/* <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: ' rgb(183, 231, 124)', p: 3,position:'relative',justifyContent:'center' }}
            > */}
       
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleSidebar}
                    edge="start"
                    sx={{ position: 'absolute', top: 18, left: 10 }}
                >
                    <MenuIcon />
                </IconButton>
                <div className='l'>
            <h1>Admin Reports Page</h1>
            <div className="reports-list">
                <h2>Reports</h2>
                <ul>
                    {reports.map(report => (
                        <li key={report.report_id} onClick={() => handleSelectReport(report)}>
                            {report.type} - {report.status}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedReport && (
                <div className="report-details">
                    <h2>Report Details</h2>
                    <p><strong>Type:</strong> {selectedReport.type}</p>
                    <p><strong>Details:</strong> {selectedReport.details}</p>
                    <p><strong>Status:</strong> {selectedReport.status}</p>
                    <button onClick={() => handleUpdateStatus(selectedReport.report_id, 'Complete')}>
                        Mark as Complete
                    </button>
                    <div className="comments-section">
                        <h3>Comments</h3>
                        <ul>
                            {comments.map(comment => (
                                <li key={comment.comment_id}>
                                    {comment.comment}
                                </li>
                            ))}
                        </ul>
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <button onClick={handleAddComment}>Add Comment</button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default AdminReportsPage;
