# Deployment Guide for Connectly

## Production Deployment Checklist

### Pre-Deployment

- [ ] Update JWT_SECRET in backend `.env`
- [ ] Set NODE_ENV to 'production'
- [ ] Enable HTTPS
- [ ] Update CORS origins
- [ ] Set secure database connection
- [ ] Configure email notifications (optional)
- [ ] Add rate limiting
- [ ] Enable logging

### Environment Variables

#### Backend Production (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connectly
JWT_SECRET=your_very_long_random_secret_key_change_this
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

#### Frontend Production (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

## Backend Deployment

### Option 1: Heroku Deployment

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create connectly-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set FRONTEND_URL=https://yourfrontend.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 2: Railway.app Deployment

```bash
# Install Railway CLI
# https://docs.railway.app/develop/cli

# Login
railway login

# Initialize project
railway init

# Set variables and deploy
railway up

# View logs
railway logs
```

### Option 3: AWS EC2 Deployment

```bash
# 1. Launch EC2 instance (Ubuntu 20.04)
# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
sudo apt-get install -y mongodb-server

# 5. Clone repository
git clone your-repo-url
cd Connectly/backend

# 6. Install dependencies
npm install

# 7. Create .env file and configure
nano .env

# 8. Start with PM2
sudo npm install -g pm2
pm2 start server.js --name "connectly-backend"
pm2 save
pm2 startup

# 9. Set up reverse proxy with Nginx
sudo apt-get install -y nginx

# 10. Configure Nginx (create /etc/nginx/sites-available/connectly)
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 11. Enable and restart Nginx
sudo ln -s /etc/nginx/sites-available/connectly /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# 12. Set up SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d api.yourdomain.com

# 13. Update Nginx configuration for HTTPS
# ... (update server block to use SSL certificates)

# 14. Restart Nginx
sudo systemctl restart nginx
```

### Option 4: Docker Deployment

```dockerfile
# Dockerfile for backend
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

```bash
# Build image
docker build -t connectly-backend .

# Run container
docker run -d \
  -e MONGODB_URI=mongodb://mongodb:27017/connectly \
  -e JWT_SECRET=your_secret \
  -p 5000:5000 \
  --name connectly-backend \
  --network connectly-network \
  connectly-backend

# Run MongoDB container
docker run -d \
  -p 27017:27017 \
  --name mongodb \
  --network connectly-network \
  mongo:4.4
```

## Frontend Deployment

### Option 1: Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Set environment variables in Vercel dashboard
# REACT_APP_API_URL=https://api.yourdomain.com/api
# REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

### Option 2: Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=build

# Configure environment variables in Netlify dashboard
```

### Option 3: GitHub Pages Deployment

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/connectly"

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts to package.json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### Option 4: AWS S3 + CloudFront

```bash
# Build project
cd frontend
npm run build

# Install AWS CLI
# https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

# Create S3 bucket
aws s3 mb s3://connectly-frontend

# Upload files
aws s3 sync build/ s3://connectly-frontend

# Create CloudFront distribution
# https://docs.aws.amazon.com/cloudfront/latest/developerguide/distribution-overview.html

# Set CloudFront URL in backend CORS
```

### Option 5: Docker Deployment

```dockerfile
# Dockerfile for frontend
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build image
docker build -t connectly-frontend .

# Run container
docker run -d \
  -p 80:80 \
  --name connectly-frontend \
  connectly-frontend
```

## Docker Compose Deployment

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:4.4
    container_name: connectly-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: connectly

  backend:
    build: ./backend
    container_name: connectly-backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://mongodb:27017/connectly
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      FRONTEND_URL: http://localhost:3000
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    container_name: connectly-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
      REACT_APP_SOCKET_URL: http://localhost:5000

volumes:
  mongo-data:
```

```bash
# Deploy with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Database Backup

### MongoDB Atlas
```bash
# Enable automatic backups in MongoDB Atlas dashboard
# Configure backup frequency and retention policy
```

### Local MongoDB
```bash
# Backup
mongodump --uri mongodb://localhost:27017/connectly --out ./backups

# Restore
mongorestore --uri mongodb://localhost:27017 ./backups
```

## SSL/TLS Configuration

### Let's Encrypt with Nginx
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Monitoring and Logging

### PM2 Monitoring
```bash
# Install PM2 Plus
pm2 install pm2-plus

# Enable monitoring
pm2 plus
```

### Log Aggregation (Optional)
```bash
# Install Winston for logging
npm install winston

# Send logs to services like:
# - LogRocket
# - Sentry
# - DataDog
# - CloudWatch
```

## Performance Optimization

### Backend
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Enable caching
app.use(express.static('public', { maxAge: '1d' }));
```

### Frontend
```javascript
// Code splitting
const Dashboard = lazy(() => import('./pages/DashboardPage'));

// Image optimization
import { Image } from 'next/image';
```

## Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection headers
- [ ] CSRF protection
- [ ] Security headers (helmet.js)
- [ ] Regular dependency updates
- [ ] Security monitoring enabled

### Add Helmet.js for security headers
```bash
npm install helmet

# In server.js
const helmet = require('helmet');
app.use(helmet());
```

## Maintenance

### Regular Tasks
- Monitor error rates and performance
- Update dependencies monthly
- Review and optimize database queries
- Check security vulnerabilities
- Backup database regularly
- Monitor server resource usage
- Update SSL certificates (auto with Let's Encrypt)

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update safely
npm update

# Major version update (be careful)
npm install package@latest
```

## Rollback Procedure

```bash
# With PM2
pm2 stop connectly-backend
pm2 start connectly-backend --name "connectly-backend"

# With Docker
docker stop connectly-backend
docker start connectly-backend

# With Vercel
vercel rollback
```

## Monitoring Services

### Free Options
- UpTimeRobot (uptime monitoring)
- New Relic (performance monitoring)
- Sentry (error tracking)
- LogRocket (session replay)

### Paid Options
- DataDog
- New Relic Pro
- Dynatrace
- Splunk

## Troubleshooting Deployment

### MongoDB Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Check connection string in .env
# Verify IP whitelist in MongoDB Atlas
```

### CORS Errors
```bash
# Update FRONTEND_URL in backend .env
# Ensure frontend URL matches exactly
```

### SSL Certificate Issues
```bash
# Verify certificate
openssl s_client -connect yourdomain.com:443

# Renew certificate
sudo certbot renew --force-renewal
```

---

Choose the deployment option that best fits your needs and infrastructure! 🚀
