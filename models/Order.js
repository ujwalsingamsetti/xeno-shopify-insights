const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shopifyId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    financialStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};