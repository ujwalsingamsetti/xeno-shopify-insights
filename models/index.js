const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/xeno_shopify', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: { require: true, rejectUnauthorized: false }
  } : {}
});

const User = require('./User')(sequelize);
const Tenant = require('./Tenant')(sequelize);
const Customer = require('./Customer')(sequelize);
const Product = require('./Product')(sequelize);
const Order = require('./Order')(sequelize);

// Associations
User.hasMany(Tenant, { foreignKey: 'userId' });
Tenant.belongsTo(User, { foreignKey: 'userId' });

Tenant.hasMany(Customer, { foreignKey: 'tenantId' });
Customer.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Product, { foreignKey: 'tenantId' });
Product.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Order, { foreignKey: 'tenantId' });
Order.belongsTo(Tenant, { foreignKey: 'tenantId' });

Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = {
  sequelize,
  User,
  Tenant,
  Customer,
  Product,
  Order
};