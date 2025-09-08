# Xeno Shopify Data Ingestion & Insights Service

A multi-tenant Shopify data ingestion and analytics platform built for the Xeno FDE Internship Assignment.

## 🚀 Features

- **Multi-tenant Architecture**: Support for multiple Shopify stores with data isolation
- **Shopify Integration**: Ingests customers, orders, and products data
- **Real-time Dashboard**: Interactive charts and metrics visualization
- **Authentication**: Email-based user authentication with JWT
- **Data Sync**: Manual and scheduled data synchronization from Shopify
- **Responsive UI**: Mobile-friendly dashboard interface

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, Sequelize ORM
- **Frontend**: React.js, Recharts for visualization
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt
- **Deployment**: Ready for Heroku/Railway/Render

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Shopify development store (optional for demo)

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd xeno-shopify-insights
npm install
cd client && npm install && cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/xeno_shopify
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb xeno_shopify

# Start the server (will auto-sync database tables)
npm run dev
```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd client && npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Shopify Integration
- `POST /api/shopify/tenant` - Add new Shopify store
- `GET /api/shopify/tenants` - Get user's stores
- `POST /api/shopify/sync/:tenantId` - Sync data from Shopify

### Insights & Analytics
- `GET /api/insights/dashboard/:tenantId` - Dashboard metrics
- `GET /api/insights/orders/:tenantId` - Orders with date filtering
- `GET /api/insights/top-customers/:tenantId` - Top 5 customers by spend
- `GET /api/insights/revenue-trend/:tenantId` - Revenue trend (30 days)

## 🗄 Database Schema

### Users
- id, email, password, name, createdAt, updatedAt

### Tenants
- id, shopifyDomain, shopifyAccessToken, name, userId, createdAt, updatedAt

### Customers
- id, shopifyId, email, firstName, lastName, totalSpent, ordersCount, tenantId

### Products
- id, shopifyId, title, price, vendor, productType, tenantId

### Orders
- id, shopifyId, orderNumber, totalPrice, currency, orderDate, financialStatus, customerId, tenantId

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express API    │────│   PostgreSQL    │
│   (Dashboard)   │    │   (Multi-tenant)│    │   (Data Store)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │  Shopify APIs   │
                       │  (Data Source)  │
                       └─────────────────┘
```

## 🚀 Deployment

### Heroku Deployment

1. Create Heroku app:
```bash
heroku create your-app-name
```

2. Add PostgreSQL addon:
```bash
heroku addons:create heroku-postgresql:mini
```

3. Set environment variables:
```bash
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
```

4. Deploy:
```bash
git push heroku main
```

### Railway/Render Deployment

1. Connect your GitHub repository
2. Add PostgreSQL database service
3. Set environment variables in dashboard
4. Deploy automatically on git push

## 🔄 Data Synchronization

The application supports both manual and automated data sync:

- **Manual Sync**: Click "Sync Data" button in dashboard
- **Automated Sync**: Implement webhooks or scheduled jobs (future enhancement)

## 📈 Dashboard Features

- **Metrics Overview**: Total customers, orders, revenue, products
- **Revenue Trend**: Line chart showing 30-day revenue trend
- **Top Customers**: Bar chart of highest spending customers
- **Recent Orders**: Table with order details and customer info
- **Date Filtering**: Filter orders by date range
- **Multi-store Support**: Switch between different Shopify stores

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Multi-tenant data isolation
- Environment variable configuration
- SQL injection prevention with Sequelize ORM

## 🎯 Assumptions Made

1. **Demo Data**: Uses mock Shopify data for demonstration purposes
2. **Single User per Tenant**: Each Shopify store belongs to one user
3. **Basic Authentication**: Simple email/password authentication
4. **USD Currency**: All monetary values assumed to be in USD
5. **Simplified Shopify Integration**: Mock API calls instead of real Shopify API

## 🚧 Known Limitations

1. **Mock Data**: Currently uses mock Shopify data instead of real API integration
2. **No Real-time Updates**: Data sync is manual, no webhooks implemented
3. **Basic Error Handling**: Limited error handling and validation
4. **No Data Validation**: Minimal input validation on forms
5. **Single Currency**: Only supports USD currency

## 🔮 Next Steps for Production

1. **Real Shopify Integration**: Implement actual Shopify API calls with OAuth
2. **Webhook Support**: Add Shopify webhooks for real-time data sync
3. **Advanced Analytics**: More sophisticated metrics and insights
4. **Data Validation**: Comprehensive input validation and sanitization
5. **Error Monitoring**: Add logging and error tracking (Sentry, etc.)
6. **Caching Layer**: Implement Redis for improved performance
7. **Rate Limiting**: Add API rate limiting and throttling
8. **Testing**: Unit and integration tests
9. **CI/CD Pipeline**: Automated testing and deployment
10. **Multi-currency Support**: Handle different currencies
11. **Advanced Authentication**: OAuth, 2FA, role-based access
12. **Data Export**: CSV/Excel export functionality
13. **Advanced Filtering**: More sophisticated data filtering options
14. **Performance Optimization**: Database indexing, query optimization

## 📝 Demo Video Script

1. **Introduction**: Explain the problem and solution
2. **Authentication**: Show registration/login flow
3. **Store Setup**: Add a new Shopify store
4. **Data Sync**: Demonstrate data synchronization
5. **Dashboard Tour**: Walk through all metrics and charts
6. **Multi-tenancy**: Switch between different stores
7. **Technical Architecture**: Explain the backend structure
8. **Future Enhancements**: Discuss production readiness

## 🤝 Contributing

This is an assignment project, but feedback and suggestions are welcome!

## 📄 License

This project is created for the Xeno FDE Internship Assignment.