# Connectly - Real-time Anonymous Communication Platform

A modern, full-stack web application for anonymous real-time communication based on shared interests and thoughts.

## Features

- **Anonymous Profiles**: Auto-generated aliases with no personal identity disclosure
- **Interest-Based Matching**: Connect with people who share your interests
- **Real-Time Chat**: Instant messaging with Socket.io
- **Smart Features**:
  - Typing indicators
  - Online/offline status
  - Smart reply suggestions (AI-powered)
  - Message safety moderation
- **Connection System**: Send/accept/reject connection requests
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Modern UI**: Pastel color scheme with smooth animations

## Tech Stack

### Frontend
- React.js 18
- React Router v6
- Axios for HTTP requests
- Socket.io-client for real-time communication
- CSS3 with custom styling (Pastel theme)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io for WebSocket communication
- JWT for authentication
- Bcryptjs for password encryption

### Real-Time Communication
- Socket.io for bidirectional communication
- Event-based architecture

## Project Structure

```
Connectly/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfileSetupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── .env.local
│   └── package.json
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Connection.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   └── ModerationLog.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── connectionController.js
│   │   └── chatController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── connectionRoutes.js
│   │   └── chatRoutes.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── utils/
│   │   ├── tokenUtils.js
│   │   ├── moderationUtils.js
│   │   └── aliasGenerator.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## Installation

### 1. Clone the Repository
```bash
cd Connectly
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# Edit .env if needed - set MongoDB URI and JWT secret

# Start the server
npm run dev
# or
npm start
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (already provided)
# Edit .env.local if needed - set API URL

# Start the development server
npm start
```

Frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/connectly
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Database Setup

### Using MongoDB Locally

1. **Install MongoDB** from https://www.mongodb.com/try/download/community

2. **Start MongoDB Service**:
   - On Windows:
   ```bash
   mongod
   ```
   - On macOS:
   ```bash
   brew services start mongodb-community
   ```

3. **Create Database**:
   ```bash
   mongo
   use connectly
   ```

### Using MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get the connection URI
4. Update `MONGODB_URI` in backend `.env` file

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Profiles
- `POST /api/profiles/upsert` - Create/update profile (protected)
- `GET /api/profiles/:userId` - Get user profile (protected)
- `GET /api/profiles` - Get all public profiles (protected)

### Connections
- `POST /api/connections/send` - Send connection request (protected)
- `POST /api/connections/accept` - Accept connection (protected)
- `POST /api/connections/reject` - Reject connection (protected)
- `GET /api/connections/pending` - Get pending requests (protected)

### Chats
- `GET /api/chats/list` - Get chat list (protected)
- `GET /api/chats/:chatId/messages` - Get messages (protected)
- `GET /api/chats/search` - Search messages (protected)
- `POST /api/chats/message` - Save message (protected)

## Socket.io Events

### Client to Server
- `userOnline` - User comes online
- `sendMessage` - Send a message
- `typing` - User is typing
- `stopTyping` - User stopped typing
- `messageSeen` - Message marked as seen
- `userOffline` - User goes offline

### Server to Client
- `receiveMessage` - Receive a message
- `smartReplySuggestions` - Get AI suggestions
- `userTyping` - Someone is typing
- `userStoppedTyping` - Someone stopped typing
- `messageSeen` - Message was seen
- `userStatusChanged` - User online/offline status

## Features Implementation Details

### Anonymous Profile Generation
- Uses adjective + noun + random number pattern
- Examples: `BrightEagle234`, `CleverFox789`

### AI Moderation
- Keyword-based filtering for harmful content
- Spam detection (special character ratio)
- Flags messages for review

### Smart Replies
- AI-powered suggestions: "Got it!", "Tell me more", "I agree!"
- Randomly selects 3 from suggestion pool
- Helps users reply faster

### Authentication
- JWT tokens valid for 7 days
- Passwords hashed with bcryptjs
- Protected routes require valid token

## Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  alias: String (unique),
  interests: [String],
  isOnline: Boolean,
  createdAt: Date
}
```

### Profile
```javascript
{
  userId: ObjectId (ref User),
  catchLine: String,
  interests: [String],
  visibilityStatus: String (public/private),
  updatedAt: Date
}
```

### Connection
```javascript
{
  senderId: ObjectId (ref User),
  receiverId: ObjectId (ref User),
  status: String (pending/accepted/rejected),
  createdAt: Date,
  updatedAt: Date
}
```

### Chat
```javascript
{
  users: [ObjectId] (ref User),
  lastMessage: String,
  lastMessageTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  chatId: ObjectId (ref Chat),
  senderId: ObjectId (ref User),
  receiverId: ObjectId (ref User),
  messageText: String,
  messageStatus: String (sent/delivered/seen),
  isModerated: Boolean,
  createdAt: Date
}
```

### ModerationLog
```javascript
{
  messageId: ObjectId (ref Message),
  result: String (safe/flagged/blocked),
  reason: String,
  checkedAt: Date
}
```

## Usage Flow

1. **Landing Page**: Introduction to Connectly
2. **Register**: Create account with email, password, and interests
3. **Profile Setup**: Add catch line and select interests
4. **Dashboard**: Browse anonymous profiles, filter by interests
5. **Connect**: Send connection requests to people
6. **Chat**: Accept connections and start chatting
7. **Settings**: Manage account and logout

## Development Notes

### Adding New Features

1. **Backend Route**: Add in `/routes`
2. **Controller**: Implement in `/controllers`
3. **Model**: Use/update in `/models`
4. **Socket Event**: Add in `server.js`
5. **Frontend**: Create component/page and API call

### Styling

- All components use inline styles
- CSS variables for consistent theming
- Pastel color scheme in `frontend/src/styles/index.css`

### Error Handling

- Try-catch blocks in all async functions
- User-friendly error messages
- Validation before API calls

## Future Enhancements

- [ ] End-to-end encryption
- [ ] Voice/video calls
- [ ] File sharing
- [ ] Message reactions
- [ ] User blocklist
- [ ] Advanced search with filters
- [ ] Message notifications
- [ ] User rating system
- [ ] Report inappropriate content
- [ ] Message pinning
- [ ] Chat groups
- [ ] Typing animation improvements

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database is created

### CORS Error
- Update `FRONTEND_URL` in backend `.env`
- Ensure both servers are running
- Check proxy setting in frontend `package.json`

### Socket Connection Error
- Verify Socket.io is initialized
- Check `REACT_APP_SOCKET_URL` in frontend `.env`
- Ensure backend server is running

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: `PORT=3001 npm start`

## Performance Tips

1. **Message Pagination**: Load messages in chunks
2. **Virtual Scrolling**: For large chat lists
3. **Debouncing**: Typing events
4. **Image Optimization**: If adding avatars
5. **Lazy Loading**: Components on demand

## Security Considerations

1. Never store sensitive data in localStorage
2. Validate all inputs on backend
3. Use HTTPS in production
4. Implement rate limiting
5. Add CSRF protection
6. Sanitize user inputs
7. Use secure cookies for tokens
8. Implement proper CORS policies

## Deployment

### Backend (Heroku)
```bash
heroku create connectly-backend
git push heroku main
```

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

## Testing

### Manual Testing with Postman

1. **Register**: POST `/api/auth/register`
2. **Login**: POST `/api/auth/login`
3. **Create Profile**: POST `/api/profiles/upsert` with Bearer token
4. **Get Profiles**: GET `/api/profiles`

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

## Contributors

- Developed with ❤️ by Sneha sharma

---

**Made with passion for meaningful anonymous connections!** 🌟
