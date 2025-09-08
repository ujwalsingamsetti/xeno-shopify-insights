# Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running
- Git

### 1. Setup Database
```bash
# Create PostgreSQL database
createdb xeno_shopify

# Or using psql
psql -c "CREATE DATABASE xeno_shopify;"
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://username:password@localhost:5432/xeno_shopify
```

### 4. Start Development Servers
```bash
# Terminal 1: Start backend (will auto-create tables)
npm run dev

# Terminal 2: Start frontend
cd client && npm start
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Production Deployment

### Heroku Deployment

#### 1. Prepare for Deployment
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Install Heroku CLI and login
heroku login
```

#### 2. Create Heroku Application
```bash
# Create new Heroku app
heroku create your-xeno-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini
```

#### 3. Configure Environment Variables
```bash
# Set JWT secret
heroku config:set JWT_SECRET=your_super_secret_jwt_key_here

# Set production environment
heroku config:set NODE_ENV=production

# Verify configuration
heroku config
```

#### 4. Deploy Application
```bash
# Deploy to Heroku
git push heroku main

# Open application
heroku open
```

#### 5. Monitor Application
```bash
# View logs
heroku logs --tail

# Check dyno status
heroku ps
```

### Railway Deployment

#### 1. Connect Repository
- Go to [Railway.app](https://railway.app)
- Connect your GitHub repository
- Select the repository

#### 2. Add Database
- Add PostgreSQL service
- Note the connection string

#### 3. Configure Environment Variables
```
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
DATABASE_URL=postgresql://... (auto-provided by Railway)
```

#### 4. Deploy
- Railway will automatically deploy on git push
- Monitor deployment in Railway dashboard

### Render Deployment

#### 1. Create Web Service
- Go to [Render.com](https://render.com)
- Create new Web Service
- Connect GitHub repository

#### 2. Configure Build Settings
```
Build Command: npm install && npm run build
Start Command: npm start
```

#### 3. Add PostgreSQL Database
- Create PostgreSQL service
- Note the connection details

#### 4. Environment Variables
```
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
DATABASE_URL=postgresql://... (from PostgreSQL service)
```

## Environment Variables Reference

### Required Variables
```env
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Optional Variables
```env
PORT=5000 (auto-set by hosting platforms)
```

## Database Migration

### For Production Deployment
The application will automatically create tables on first run using Sequelize sync.

### Manual Migration (if needed)
```bash
# Connect to production database
heroku pg:psql

# Or for other platforms, use the DATABASE_URL
psql $DATABASE_URL
```

## Post-Deployment Checklist

### 1. Verify Application Health
- [ ] Application loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays correctly
- [ ] Database connections are stable

### 2. Test Core Functionality
- [ ] Create user account
- [ ] Add Shopify store (tenant)
- [ ] Sync mock data
- [ ] View dashboard metrics
- [ ] Check responsive design

### 3. Monitor Performance
- [ ] Check application logs
- [ ] Monitor database connections
- [ ] Verify API response times
- [ ] Test under load (if applicable)

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test database connection
psql $DATABASE_URL -c "SELECT 1;"
```

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variable Issues
```bash
# Check all environment variables
heroku config  # For Heroku
# Or check platform-specific dashboard
```

### Performance Optimization

#### Database Optimization
- Add database indexes for frequently queried fields
- Implement connection pooling
- Use read replicas for analytics queries

#### Application Optimization
- Enable gzip compression
- Implement caching strategies
- Optimize bundle size
- Use CDN for static assets

## Monitoring and Maintenance

### Logging
- Monitor application logs regularly
- Set up log aggregation (Papertrail, Loggly)
- Configure error alerting

### Backup Strategy
- Regular database backups
- Test backup restoration
- Document recovery procedures

### Security Updates
- Regular dependency updates
- Security vulnerability scanning
- SSL certificate management

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Session management with Redis
- Database connection pooling

### Vertical Scaling
- Monitor resource usage
- Upgrade dyno/instance sizes as needed
- Database performance tuning

## Support and Maintenance

### Regular Tasks
- [ ] Weekly dependency updates
- [ ] Monthly security audits
- [ ] Quarterly performance reviews
- [ ] Database maintenance and optimization

### Emergency Procedures
- Application rollback procedures
- Database recovery steps
- Contact information for critical issues