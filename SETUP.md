# Quick Start Guide for Connectly

## Prerequisites
- Node.js installed (v14+)
- MongoDB installed or MongoDB Atlas account
- Git installed
- A code editor (VS Code recommended)

## Step 1: Clone and Navigate
```bash
cd Connectly
```

## Step 2: Start MongoDB
Before starting the backend, make sure MongoDB is running:

### Windows
```bash
mongod
```

### macOS
```bash
brew services start mongodb-community
```

### Using MongoDB Atlas
Skip this if using cloud MongoDB. Just update the connection string in backend `.env`.

## Step 3: Start Backend Server

```bash
cd backend
npm install
npm run dev
```

You should see: `Server running on port 5000`

## Step 4: Start Frontend (in a new terminal)

```bash
cd frontend
npm install
npm start
```

Frontend will automatically open at `http://localhost:3000`

## Step 5: Test the Application

1. **Go to Landing Page** → Click "Get Started"
2. **Register** → Fill email, password, select interests
3. **Setup Profile** → Add a catch line, select interests
4. **Dashboard** → Browse anonymous profiles, filter by interests
5. **Connect** → Click "Connect" on profiles you like
6. **Chat** → Accept connections and start chatting

## Default Test Credentials

After registration, use your email to login.

## Troubleshooting

### Port 5000 already in use?
```bash
# Change in backend .env
PORT=5001
# Restart backend server
```

### Port 3000 already in use?
```bash
# Kill the process or use different port
PORT=3001 npm start
```

### MongoDB Connection Error?
1. Ensure `mongod` is running
2. Check MongoDB connection string in `backend/.env`
3. Try restarting MongoDB service

### Module not found errors?
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Architecture

```
Frontend (React) ↔ Backend (Express + Socket.io) ↔ MongoDB
   :3000                :5000                      :27017
```

## Key Technologies

- **Frontend**: React, Socket.io Client, Axios
- **Backend**: Express.js, Socket.io, Mongoose, JWT
- **Database**: MongoDB
- **Auth**: JWT + Bcryptjs
- **Real-time**: WebSocket via Socket.io

## Features Quick Tour

### 1. Anonymous Identity
- Auto-generated alias (e.g., BrightPhoenix123)
- No personal information shared

### 2. Interest-Based Discovery
- Filter users by interests
- Connect with like-minded people

### 3. Real-Time Chat
- Instant messaging
- Typing indicators
- Online/offline status
- Smart reply suggestions

### 4. AI Moderation
- Message safety checks
- Harmful content detection
- Spam filtering

## Common Commands

```bash
# Backend
npm run dev        # Start with auto-reload
npm start          # Start normally

# Frontend
npm start          # Start dev server
npm build          # Create production build
npm test           # Run tests

# Database
# Open another terminal and run: mongod
```

## Project Structure Overview

```
Connectly/
├── backend/          # Express.js + MongoDB API
├── frontend/         # React.js web app
├── .gitignore
└── README.md
```

## Environment Files

### Backend (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/connectly
JWT_SECRET=your_secret_key_change_this
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (frontend/.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## API Base URL

All API calls go to: `http://localhost:5000/api/`

## Socket.io Events

**Key events for real-time chat:**
- `userOnline` - User comes online
- `sendMessage` - Send message
- `receiveMessage` - Receive message
- `typing` - Typing indicator
- `messageSeen` - Message read receipt

## Next Steps

1. ✅ Start the servers
2. ✅ Create an account
3. ✅ Setup profile
4. ✅ Browse and connect with people
5. ✅ Start chatting!

## Additional Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **Socket.io Docs**: https://socket.io/docs/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/

## Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure both frontend and backend are running
3. Verify MongoDB is connected
4. Check `.env` files for correct configurations
5. Review README.md for detailed documentation

## Tips for Development

- **Hot Reload**: Both frontend and backend support auto-reload on file changes
- **DevTools**: Use browser DevTools for frontend debugging
- **Network Tab**: Monitor API calls in browser DevTools
- **Console Logs**: Check backend terminal for server logs
- **Postman**: Test API endpoints independently

---

Happy chatting on Connectly! 🚀
