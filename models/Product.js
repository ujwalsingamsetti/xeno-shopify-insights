const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shopifyId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    productType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inventory: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};