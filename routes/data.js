const express = require('express');
const { Customer, Product, Order, Tenant } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Add new customer
router.post('/customers/:tenantId', auth, async (req, res) => {
  try {
    const { email, firstName, lastName, phone, address } = req.body;
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const customer = await Customer.create({
      shopifyId: `manual_${Date.now()}`,
      email,
      firstName,
      lastName,
      phone,
      address,
      tenantId: tenant.id
    });

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer' });
  }
});

// Add new product
router.post('/products/:tenantId', auth, async (req, res) => {
  try {
    const { title, price, vendor, productType, inventory } = req.body;
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const product = await Product.create({
      shopifyId: `manual_${Date.now()}`,
      title,
      price,
      vendor,
      productType,
      inventory,
      tenantId: tenant.id
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Add new order
router.post('/orders/:tenantId', auth, async (req, res) => {
  try {
    const { customerId, totalPrice, orderDate, financialStatus } = req.body;
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const order = await Order.create({
      shopifyId: `manual_${Date.now()}`,
      orderNumber: `ORD-${Date.now()}`,
      totalPrice,
      orderDate: new Date(orderDate),
      financialStatus,
      customerId,
      tenantId: tenant.id
    });

    // Update customer total spent
    if (customerId) {
      const customer = await Customer.findByPk(customerId);
      if (customer) {
        customer.totalSpent = parseFloat(customer.totalSpent) + parseFloat(totalPrice);
        customer.ordersCount += 1;
        await customer.save();
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get all customers for a tenant
router.get('/customers/:tenantId', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const customers = await Customer.findAll({
      where: { tenantId: tenant.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

// Get all products for a tenant
router.get('/products/:tenantId', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const products = await Product.findAll({
      where: { tenantId: tenant.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Search functionality
router.get('/search/:tenantId', auth, async (req, res) => {
  const { Op } = require('sequelize');
  try {
    const { q, type } = req.query;
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    let results = [];
    
    if (type === 'customers' || !type) {
      const customers = await Customer.findAll({
        where: {
          tenantId: tenant.id,
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${q}%` } },
            { lastName: { [Op.iLike]: `%${q}%` } },
            { email: { [Op.iLike]: `%${q}%` } }
          ]
        }
      });
      results.push(...customers);
    }

    if (type === 'products' || !type) {
      const products = await Product.findAll({
        where: {
          tenantId: tenant.id,
          title: { [Op.iLike]: `%${q}%` }
        }
      });
      results.push(...products);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;