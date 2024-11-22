// import React, { useState } from 'react';
// import axios from 'axios';

// const UserReportPage = () => {
//     const [type, setType] = useState('');
//     const [details, setDetails] = useState('');
//     const [reports, setReports] = useState([]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:3002/reports', { type, details }, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             setReports([...reports, response.data.report]);
//             setType('');
//             setDetails('');
//         } catch (error) {
//             console.error('Error submitting report:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Submit a Report</h1>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     Type:
//                     <select value={type} onChange={(e) => setType(e.target.value)} required>
//                         <option value="">Select a report type</option>
//                         <option value="User Info Change">User Info Change</option>
//                         <option value="Wrong Item Sale">Wrong Item Sale</option>
//                         <option value="Doctor Complaint">Doctor Complaint</option>
//                     </select>
//                 </label>
//                 <br />
//                 <label>
//                     Details:
//                     <textarea value={details} onChange={(e) => setDetails(e.target.value)} required />
//                 </label>
//                 <br />
//                 <button type="submit">Submit Report</button>
//             </form>
//             <div className="user-reports">
//                 <h2>Your Reports</h2>
//                 <ul>
//                     {reports.map(report => (
//                         <li key={report.report_id}>
//                             {report.type} - {report.status}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default UserReportPage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';
const UserReportPage = () => {
    const [type, setType] = useState('');
    const [details, setDetails] = useState('');
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    // Fetch user reports when the component mounts
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:3002/reports/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);

    // Fetch comments for the selected report
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3002/reports', { type, details }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReports([...reports, response.data.report]);
            setType('');
            setDetails('');
        } catch (error) {
            console.error('Error submitting report:', error);
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
            <div className='l'>
            <h1>Submit a Report</h1>
            <div className='outer'>
            <form onSubmit={handleSubmit}>
                <label>
                    Type:
                    <select value={type} onChange={(e) => setType(e.target.value)} required>
                        <option value="">Select a report type</option>
                        <option value="User Info Change">User Info Change</option>
                        <option value="Wrong Item Sale">Wrong Item Sale</option>
                        <option value="Doctor Complaint">Doctor Complaint</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
                <br />
                <label>
                    Details:
                    <input value={details} onChange={(e) => setDetails(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Submit Report</button>
            </form>
            </div>

            <div className="user-reports">
                <h2>Your Reports</h2>
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
                    <div className="comments-section">
                        <h3>Comments</h3>
                        <ul>
                            {comments.map(comment => (
                                <li className="com"key={comment.comment_id}>
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

export default UserReportPage;

