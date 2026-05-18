# Connectly - Installation & Verification Checklist

## ✅ Pre-Installation Requirements

- [ ] Node.js v14+ installed (`node -v` to check)
- [ ] npm installed (`npm -v` to check)
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Git installed
- [ ] VS Code or preferred code editor
- [ ] Terminal/Command Prompt access

## ✅ Project Files Verification

### Root Level Files
- [ ] README.md - Main documentation
- [ ] SETUP.md - Quick start guide
- [ ] PROJECT_SUMMARY.md - Project overview
- [ ] FEATURES.md - Feature list
- [ ] API_TESTING.md - API testing guide
- [ ] DEPLOYMENT.md - Deployment guide
- [ ] CONTRIBUTING.md - Contributing guidelines
- [ ] .gitignore - Git ignore rules

### Backend Folder Structure
- [ ] `backend/package.json` - Dependencies
- [ ] `backend/.env` - Environment variables
- [ ] `backend/server.js` - Main server file
- [ ] `backend/config/db.js` - Database config
- [ ] `backend/models/` - 6 MongoDB schemas
  - [ ] User.js
  - [ ] Profile.js
  - [ ] Connection.js
  - [ ] Chat.js
  - [ ] Message.js
  - [ ] ModerationLog.js
- [ ] `backend/controllers/` - 4 controller files
  - [ ] authController.js
  - [ ] profileController.js
  - [ ] connectionController.js
  - [ ] chatController.js
- [ ] `backend/routes/` - 4 route files
  - [ ] authRoutes.js
  - [ ] profileRoutes.js
  - [ ] connectionRoutes.js
  - [ ] chatRoutes.js
- [ ] `backend/middlewares/auth.js` - JWT middleware
- [ ] `backend/utils/` - 3 utility files
  - [ ] tokenUtils.js
  - [ ] moderationUtils.js
  - [ ] aliasGenerator.js
- [ ] `backend/.gitignore` - Backend git ignore

### Frontend Folder Structure
- [ ] `frontend/package.json` - Dependencies
- [ ] `frontend/.env.local` - Environment variables
- [ ] `frontend/public/index.html` - HTML entry
- [ ] `frontend/src/App.jsx` - Main app component
- [ ] `frontend/src/index.jsx` - React entry
- [ ] `frontend/src/styles/index.css` - Global styles
- [ ] `frontend/src/components/` - Components
  - [ ] Navbar.jsx
- [ ] `frontend/src/pages/` - 7 page components
  - [ ] LandingPage.jsx
  - [ ] RegisterPage.jsx
  - [ ] LoginPage.jsx
  - [ ] ProfileSetupPage.jsx
  - [ ] DashboardPage.jsx
  - [ ] ChatPage.jsx
  - [ ] SettingsPage.jsx
- [ ] `frontend/src/utils/` - 3 utility files
  - [ ] api.js
  - [ ] socket.js
  - [ ] auth.js
- [ ] `frontend/.gitignore` - Frontend git ignore

## ✅ Installation Steps

### Step 1: Backend Setup
```bash
cd backend
npm install
```
- [ ] Dependencies installed successfully
- [ ] No error messages
- [ ] node_modules folder created

### Step 2: Frontend Setup
```bash
cd frontend
npm install
```
- [ ] Dependencies installed successfully
- [ ] No error messages
- [ ] node_modules folder created

### Step 3: MongoDB Setup
- [ ] MongoDB installed locally OR
- [ ] MongoDB Atlas account created
- [ ] Database connection string ready

### Step 4: Environment Configuration
**Backend (.env)**
- [ ] PORT set to 5000
- [ ] MONGODB_URI set correctly
- [ ] JWT_SECRET configured
- [ ] NODE_ENV set to 'development'
- [ ] FRONTEND_URL set to http://localhost:3000

**Frontend (.env.local)**
- [ ] REACT_APP_API_URL set to http://localhost:5000/api
- [ ] REACT_APP_SOCKET_URL set to http://localhost:5000

## ✅ Verification Tests

### Backend Verification
```bash
cd backend
npm run dev
```
Expected output:
- [ ] `MongoDB Connected: localhost` (or your connection)
- [ ] `Server running on port 5000`
- [ ] No error messages
- [ ] Ready for requests

### Frontend Verification
```bash
cd frontend
npm start
```
Expected output:
- [ ] Browser opens to http://localhost:3000
- [ ] Landing page displays
- [ ] No console errors
- [ ] Page loads successfully

### Database Verification
```bash
# In MongoDB shell
use connectly
show collections
```
- [ ] Collections created after registration
- [ ] Users collection exists
- [ ] No data errors

### API Verification
Using Postman or curl:
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "test@example.com",
  "password": "Test123",
  "confirmPassword": "Test123",
  "interests": ["Technology"]
}
```
- [ ] Response status 201
- [ ] User created successfully
- [ ] Token received

### Socket.io Verification
Browser console:
```javascript
const socket = io('http://localhost:5000');
socket.emit('userOnline', 'user-id');
```
- [ ] No connection errors
- [ ] Socket connected successfully
- [ ] Events emitted/received

## ✅ Feature Testing Checklist

### Authentication
- [ ] User can register
- [ ] User can login
- [ ] Token stored in localStorage
- [ ] Protected routes work
- [ ] Logout clears token

### Profile
- [ ] Auto-generated alias displays
- [ ] Can set catch line
- [ ] Can select interests
- [ ] Profile saves correctly
- [ ] Profile can be updated

### Discovery
- [ ] Dashboard loads profiles
- [ ] Profiles show alias, catch line, interests
- [ ] Filter by interests works
- [ ] Online/offline status shows
- [ ] Can connect to users

### Connections
- [ ] Connection request sends
- [ ] Receiver sees pending request
- [ ] Can accept connection
- [ ] Can reject connection
- [ ] Chat created on acceptance

### Chat
- [ ] Can send messages
- [ ] Messages display in real-time
- [ ] Typing indicator works
- [ ] Online status updates
- [ ] Chat history persists
- [ ] Can search messages

### Moderation
- [ ] Harmful content is flagged
- [ ] Smart replies generate
- [ ] Messages are logged
- [ ] Safe messages pass through

### UI/UX
- [ ] All pages responsive
- [ ] Pastel colors display correctly
- [ ] Navigation works
- [ ] Forms validate input
- [ ] Error messages display
- [ ] Animations are smooth

## ✅ Browser Compatibility Check

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome
- [ ] Mobile Safari

## ✅ Performance Checks

- [ ] Page loads < 3 seconds
- [ ] Messages send < 500ms
- [ ] Chat list loads quickly
- [ ] No console warnings
- [ ] No memory leaks (check DevTools)
- [ ] Responsive scrolling

## ✅ Security Checks

- [ ] JWT token required for protected routes
- [ ] Passwords are hashed
- [ ] Tokens expire after 7 days
- [ ] CORS configured correctly
- [ ] No secrets in code
- [ ] Input validation works
- [ ] Message moderation active

## ✅ Data Validation

- [ ] Email format validation
- [ ] Password strength checked
- [ ] Catch line length limited
- [ ] Interests are arrays
- [ ] Message text validated
- [ ] Chat ID format checked

## ✅ Error Handling

- [ ] Login error message displays
- [ ] Registration error shows
- [ ] Network errors handled
- [ ] Invalid token error shown
- [ ] Database error caught
- [ ] Server error response formatted

## ✅ Documentation Review

- [ ] README.md is comprehensive
- [ ] SETUP.md is clear
- [ ] API_TESTING.md has examples
- [ ] DEPLOYMENT.md is detailed
- [ ] FEATURES.md lists all features
- [ ] Code has comments
- [ ] Variables are named clearly

## ✅ Ready for Development?

If all checkboxes above are checked, you're ready to:
- [ ] Start adding new features
- [ ] Deploy to production
- [ ] Share with team
- [ ] Add more user testing
- [ ] Optimize performance
- [ ] Scale the application

## ✅ Troubleshooting Checklist

If something doesn't work:

### Port Issues
- [ ] Check if port 5000 is in use: `netstat -ano | findstr :5000`
- [ ] Try different port in .env
- [ ] Restart computer if needed

### MongoDB Issues
- [ ] Verify MongoDB is running
- [ ] Check connection string
- [ ] Verify database exists
- [ ] Check credentials

### CORS Issues
- [ ] Verify FRONTEND_URL in backend .env
- [ ] Check frontend API_URL matches
- [ ] Clear browser cache
- [ ] Restart both servers

### Module Issues
- [ ] Delete node_modules folder
- [ ] Delete package-lock.json
- [ ] Run npm install again
- [ ] Check npm version

### Socket.io Issues
- [ ] Verify Socket.io is initialized
- [ ] Check SOCKET_URL in frontend
- [ ] Look for connection errors in console
- [ ] Verify backend is running

## 📝 Quick Commands Reference

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev             # Start with auto-reload
npm start               # Start normally

# Frontend
cd frontend
npm install             # Install dependencies
npm start              # Start dev server
npm build              # Create production build

# Database
mongod                 # Start MongoDB (if local)
mongo                  # Open MongoDB shell

# Useful Git commands
git init               # Initialize repo
git add .              # Stage all changes
git commit -m "msg"    # Commit changes
git push origin main   # Push to GitHub
```

## 🎯 Success Indicators

Your Connectly is working perfectly when:

1. ✅ You can register and login
2. ✅ You see an anonymous alias
3. ✅ You can set up your profile
4. ✅ You can browse other profiles
5. ✅ You can send connection requests
6. ✅ You can accept connections
7. ✅ You can chat in real-time
8. ✅ You see typing indicators
9. ✅ You receive smart suggestions
10. ✅ The UI is responsive and beautiful

## 📞 Support Resources

If you need help:

1. Check **README.md** - Comprehensive documentation
2. Review **SETUP.md** - Common setup issues
3. See **API_TESTING.md** - How to test APIs
4. Read **DEPLOYMENT.md** - Production setup
5. Check **FEATURES.md** - What's included
6. Review code comments - Implementation details

## 🎉 You're All Set!

Once all checkboxes are verified, your Connectly application is:
- ✅ Fully functional
- ✅ Production-ready
- ✅ Well-documented
- ✅ Easily extensible
- ✅ Secure and optimized

**Happy coding with Connectly!** 🚀

---

**Last Updated:** May 16, 2026
