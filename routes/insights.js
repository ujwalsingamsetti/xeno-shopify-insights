const express = require('express');
const { Tenant, Customer, Product, Order } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard metrics
router.get('/dashboard/:tenantId', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const totalCustomers = await Customer.count({ where: { tenantId: tenant.id } });
    const totalProducts = await Product.count({ where: { tenantId: tenant.id } });
    const totalOrders = await Order.count({ where: { tenantId: tenant.id } });
    
    const totalRevenue = await Order.sum('totalPrice', { where: { tenantId: tenant.id } }) || 0;

    res.json({
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders by date range
router.get('/orders/:tenantId', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const whereClause = { tenantId: tenant.id };
    if (startDate && endDate) {
      whereClause.orderDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const orders = await Order.findAll({
      where: whereClause,
      order: [['orderDate', 'DESC']],
      include: [{ model: Customer, attributes: ['firstName', 'lastName', 'email'] }]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get top customers by spend
router.get('/top-customers/:tenantId', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const topCustomers = await Customer.findAll({
      where: { tenantId: tenant.id },
      order: [['totalSpent', 'DESC']],
      limit: 5
    });

    res.json(topCustomers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get revenue trend (last 30 days)
router.get('/revenue-trend/:tenantId', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.findAll({
      where: {
        tenantId: tenant.id,
        orderDate: { [Op.gte]: thirtyDaysAgo }
      },
      order: [['orderDate', 'ASC']]
    });

    // Group by date
    const revenueByDate = {};
    orders.forEach(order => {
      const date = order.orderDate.toISOString().split('T')[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + parseFloat(order.totalPrice);
    });

    const trendData = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue
    }));

    res.json(trendData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;