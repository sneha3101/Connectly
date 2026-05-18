# API Testing Guide for Connectly

This guide helps you test Connectly APIs using Postman or curl.

## Setup

1. Import the API environment variables:
   - Backend URL: `http://localhost:5000`
   - API Base: `http://localhost:5000/api`

2. Keep a Bearer token from login response for protected endpoints

## 1. Authentication APIs

### Register User
**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "interests": ["Technology", "Music"]
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "alias": "BrightEagle234",
    "interests": ["Technology", "Music"]
  }
}
```

### Login
**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "alias": "BrightEagle234",
    "interests": ["Technology", "Music"]
  }
}
```

### Get Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "alias": "BrightEagle234",
    "interests": ["Technology", "Music"]
  }
}
```

## 2. Profile APIs

### Create/Update Profile
**POST** `/api/profiles/upsert`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "catchLine": "I love technology and music",
  "interests": ["Technology", "Music", "Gaming"]
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "catchLine": "I love technology and music",
    "interests": ["Technology", "Music", "Gaming"],
    "visibilityStatus": "public",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User Profile
**GET** `/api/profiles/:userId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "profile": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "alias": "BrightEagle234",
      "interests": ["Technology", "Music", "Gaming"]
    },
    "catchLine": "I love technology and music",
    "interests": ["Technology", "Music", "Gaming"]
  }
}
```

### Get All Public Profiles
**GET** `/api/profiles?interests=Technology,Music`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `interests` (optional): Comma-separated interests to filter by

**Response:**
```json
{
  "profiles": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": {
        "_id": "507f1f77bcf86cd799439020",
        "alias": "CleverFox456",
        "interests": ["Technology", "Gaming"],
        "isOnline": true
      },
      "catchLine": "Tech enthusiast and gamer",
      "interests": ["Technology", "Gaming"]
    }
  ]
}
```

## 3. Connection APIs

### Send Connection Request
**POST** `/api/connections/send`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "receiverId": "507f1f77bcf86cd799439020"
}
```

**Response:**
```json
{
  "message": "Connection request sent",
  "connection": {
    "_id": "507f1f77bcf86cd799439013",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439020",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Accept Connection Request
**POST** `/api/connections/accept`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "connectionId": "507f1f77bcf86cd799439013"
}
```

**Response:**
```json
{
  "message": "Connection accepted",
  "connection": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "accepted",
    "updatedAt": "2024-01-15T10:35:00Z"
  },
  "chatId": "507f1f77bcf86cd799439015"
}
```

### Reject Connection Request
**POST** `/api/connections/reject`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "connectionId": "507f1f77bcf86cd799439013"
}
```

### Get Pending Connections
**GET** `/api/connections/pending`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "connections": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "senderId": {
        "_id": "507f1f77bcf86cd799439020",
        "alias": "CleverFox456",
        "interests": ["Technology", "Gaming"],
        "isOnline": true
      },
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## 4. Chat APIs

### Get Chat List
**GET** `/api/chats/list`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "chats": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "users": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "alias": "BrightEagle234",
          "isOnline": true
        },
        {
          "_id": "507f1f77bcf86cd799439020",
          "alias": "CleverFox456",
          "isOnline": false
        }
      ],
      "lastMessage": "Hey, how are you?",
      "lastMessageTime": "2024-01-15T10:40:00Z",
      "updatedAt": "2024-01-15T10:40:00Z"
    }
  ]
}
```

### Get Chat Messages
**GET** `/api/chats/:chatId/messages?skip=0&limit=50`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (optional): Number of messages to skip (pagination)
- `limit` (optional): Number of messages to return (default: 50)

**Response:**
```json
{
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "chatId": "507f1f77bcf86cd799439015",
      "senderId": {
        "_id": "507f1f77bcf86cd799439011",
        "alias": "BrightEagle234"
      },
      "messageText": "Hey, how are you?",
      "messageStatus": "seen",
      "isModerated": false,
      "createdAt": "2024-01-15T10:40:00Z"
    }
  ]
}
```

### Search Messages
**GET** `/api/chats/search?chatId=...&query=hello`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `chatId`: Chat ID to search in
- `query`: Search term

**Response:**
```json
{
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "messageText": "hello world",
      "createdAt": "2024-01-15T10:40:00Z"
    }
  ]
}
```

### Save Message
**POST** `/api/chats/message`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "chatId": "507f1f77bcf86cd799439015",
  "receiverId": "507f1f77bcf86cd799439020",
  "messageText": "Hey! How are you doing?"
}
```

**Response:**
```json
{
  "message": {
    "_id": "507f1f77bcf86cd799439016",
    "chatId": "507f1f77bcf86cd799439015",
    "senderId": "507f1f77bcf86cd799439011",
    "messageText": "Hey! How are you doing?",
    "messageStatus": "sent",
    "isModerated": false,
    "createdAt": "2024-01-15T10:40:00Z"
  },
  "moderation": {
    "isSafe": true,
    "reason": null
  }
}
```

## Testing Workflow

1. **Register** two users
2. **Setup profiles** for both
3. **Get all profiles** and note a user ID
4. **Send connection** request to that user
5. **Login as second user**
6. **Accept connection** request
7. **Get chat list** and select a chat
8. **Get messages** from that chat
9. **Save a message** and verify moderation
10. **Search messages** to find specific content

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not authorized for action)
- `404` - Not Found
- `500` - Server Error

## Socket.io Testing

Use any Socket.io client library or browser console:

```javascript
// In browser console
const socket = io('http://localhost:5000');

// Emit events
socket.emit('userOnline', userId);
socket.emit('sendMessage', {
  chatId: chatId,
  senderId: senderId,
  receiverId: receiverId,
  messageText: 'Hello!'
});

// Listen to events
socket.on('receiveMessage', (data) => {
  console.log('Received:', data);
});
```

## Rate Limiting Recommendations

For production, add rate limiting:
- 100 requests per minute per IP
- 10 requests per second per user
- 1000 messages per hour per user

---

Happy testing! 🚀
