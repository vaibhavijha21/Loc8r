# Lost & Found System - Frontend & Backend Integration Guide

## Overview
This guide explains how to run and test the integrated lost and found system with both frontend and backend components working together.

## Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Git

## Database Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE lostfound;
USE lostfound;

-- Users table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    User_name VARCHAR(255),
    Contact VARCHAR(20),
    Email VARCHAR(255) UNIQUE NOT NULL,
    User_Department VARCHAR(255),
    Password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE Item (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    Item_name VARCHAR(255) NOT NULL,
    Item_description TEXT,
    Item_status ENUM('lost', 'found') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lost items table
CREATE TABLE LostItem (
    LostID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT,
    UserID INT,
    Lost_Date DATE,
    PossibleLocation VARCHAR(255),
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Found items table
CREATE TABLE FoundItem (
    FoundID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT,
    UserID INT,
    Reported_Date DATE,
    Location VARCHAR(255),
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Images table
CREATE TABLE Images (
    ImageID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT,
    FoundID INT,
    Url VARCHAR(500),
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID),
    FOREIGN KEY (FoundID) REFERENCES FoundItem(FoundID)
);
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd Loc8r/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The `.env` file has been created with the following configuration:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=lostfound
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

### 4. Start Backend Server
```bash
npm run dev
```
The backend will run on `http://localhost:4000`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd Loc8r/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend Development Server
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## Integration Features

### 1. Authentication System
- **Backend Authentication**: Uses JWT tokens for secure authentication
- **User Registration**: Users can create accounts with name, email, contact, and department
- **User Login**: Secure login with email and password
- **Token Management**: Automatic token storage and management in localStorage

### 2. Item Management
- **Create Items**: Users can report lost or found items
- **Image Upload**: Support for multiple image uploads (up to 5MB each)
- **Item Listing**: View all reported items with filtering and search
- **Item Details**: Detailed view of individual items

### 3. API Integration
- **RESTful API**: Clean API endpoints for all operations
- **Error Handling**: Comprehensive error handling and user feedback
- **File Upload**: Multer middleware for handling image uploads
- **CORS Configuration**: Proper CORS setup for frontend-backend communication

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item (requires authentication)
- `GET /api/items/search` - Search items with query parameters

## Testing the Integration

### 1. Start Both Servers
Make sure both backend (port 4000) and frontend (port 5173) are running.

### 2. Test User Registration
1. Navigate to `http://localhost:5173`
2. You'll be redirected to the login page
3. Click "Sign Up" to create a new account
4. Fill in the registration form
5. Submit the form

### 3. Test User Login
1. Use the credentials from registration
2. Click "Log In"
3. You should be redirected to the dashboard

### 4. Test Item Reporting
1. On the dashboard, click "Report Lost Item" or "Report Found Item"
2. Fill in the item details
3. Upload images (optional)
4. Submit the form
5. The item should appear in the dashboard

### 5. Test Item Viewing
1. Browse through the items on the dashboard
2. Click on any item to view details
3. Use the search and filter functionality

## File Structure

```
Loc8r/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Main server file
│   │   ├── db.js                 # Database connection
│   │   ├── routes/
│   │   │   ├── auth.js           # Authentication routes
│   │   │   └── items.js          # Item management routes
│   │   ├── middlewares/
│   │   │   ├── auth.js           # JWT authentication middleware
│   │   │   └── upload.js         # File upload middleware
│   │   └── utils/
│   │       └── auth.js            # Authentication utilities
│   ├── uploads/                  # Uploaded files directory
│   └── .env                      # Environment configuration
└── frontend/
    ├── src/
    │   ├── App.jsx               # Main app component
    │   ├── services/
    │   │   └── api.js            # API service for backend communication
    │   └── components1/
    │       ├── BackendAuthentication.jsx      # Authentication component
    │       ├── BackendLostAndFoundDashboard.jsx # Main dashboard
    │       └── Sidebar.jsx       # Navigation sidebar
    └── package.json
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the backend CORS configuration matches your frontend URL
   - Check that both servers are running on the correct ports

2. **Database Connection Issues**
   - Verify MySQL is running
   - Check database credentials in `.env` file
   - Ensure the database and tables are created

3. **Authentication Issues**
   - Check JWT_SECRET in `.env` file
   - Verify token storage in browser localStorage
   - Check network requests in browser developer tools

4. **File Upload Issues**
   - Ensure uploads directory exists and has proper permissions
   - Check file size limits (5MB max)
   - Verify multer configuration

### Debug Steps

1. **Check Server Logs**
   - Backend: Check terminal output for errors
   - Frontend: Check browser console for errors

2. **Network Requests**
   - Open browser developer tools
   - Check Network tab for failed requests
   - Verify API endpoints are accessible

3. **Database Verification**
   - Connect to MySQL and verify tables exist
   - Check if data is being inserted correctly

## Production Deployment

### Security Considerations
1. Change JWT_SECRET to a secure random string
2. Use environment variables for all sensitive data
3. Implement proper input validation and sanitization
4. Use HTTPS in production
5. Implement rate limiting
6. Add proper error logging

### Performance Optimization
1. Implement database indexing
2. Add caching mechanisms
3. Optimize image uploads and storage
4. Implement pagination for large datasets

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Ensure both servers are running
4. Check the console logs for specific error messages

The integration is now complete and ready for testing!