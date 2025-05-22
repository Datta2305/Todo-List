# MERN Todo Application

A full-featured todo application built with the MERN stack (MongoDB, Express.js, React, Node.js) that includes:

- User authentication (register/login)
- Todo management (create, complete, delete tasks)
- Dark/light theme switching
- Responsive design for all devices
- Smooth animations and modern UI

## Installation

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local instance or Atlas URI)
- Git (optional)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/mern-todo-app.git
   cd mern-todo-app
Set up the backend:

bash
Copy
Download
cd server
npm install
echo "MONGO_URI=mongodb://localhost:27017/todo-mern" > .env
echo "JWT_SECRET=your_secure_secret_here" >> .env
echo "PORT=5000" >> .env
Set up the frontend:

bash
Copy
Download
cd ../client
npm install
Run the application:

Start the backend (in one terminal):

bash
Copy
Download
cd server && node server.js
Start the frontend (in another terminal):

bash
Copy
Download
cd client && npm start
Access the app:
Open http://localhost:3000 in your browser
