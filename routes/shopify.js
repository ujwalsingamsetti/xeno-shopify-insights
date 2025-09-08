const express = require('express');
const axios = require('axios');
const { Tenant, Customer, Product, Order } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Add tenant (Shopify store)
router.post('/tenant', auth, async (req, res) => {
  try {
    const { shopifyDomain, shopifyAccessToken, name } = req.body;
    
    const tenant = await Tenant.create({
      shopifyDomain,
      shopifyAccessToken,
      name,
      userId: req.user.id
    });

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's tenants
router.get('/tenants', auth, async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      where: { userId: req.user.id }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Sync data from Shopify
router.post('/sync/:tenantId', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId, userId: req.user.id }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Mock Shopify API calls - replace with actual API calls
    const mockCustomers = [
      { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', total_spent: '150.00', orders_count: 3 },
      { id: '2', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', total_spent: '300.00', orders_count: 5 }
    ];

    const mockProducts = [
      { id: '1', title: 'T-Shirt', price: '25.00', vendor: 'Fashion Co', product_type: 'Apparel' },
      { id: '2', title: 'Jeans', price: '75.00', vendor: 'Denim Brand', product_type: 'Apparel' }
    ];

    const mockOrders = [
      { id: '1', order_number: '1001', total_price: '50.00', created_at: new Date(), financial_status: 'paid', customer: { id: '1' } },
      { id: '2', order_number: '1002', total_price: '100.00', created_at: new Date(), financial_status: 'paid', customer: { id: '2' } }
    ];

    // Sync customers
    for (const customerData of mockCustomers) {
      await Customer.upsert({
        shopifyId: customerData.id,
        email: customerData.email,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        totalSpent: customerData.total_spent,
        ordersCount: customerData.orders_count,
        tenantId: tenant.id
      });
    }

    // Sync products
    for (const productData of mockProducts) {
      await Product.upsert({
        shopifyId: productData.id,
        title: productData.title,
        price: productData.price,
        vendor: productData.vendor,
        productType: productData.product_type,
        tenantId: tenant.id
      });
    }

    // Sync orders
    for (const orderData of mockOrders) {
      const customer = await Customer.findOne({
        where: { shopifyId: orderData.customer.id, tenantId: tenant.id }
      });

      await Order.upsert({
        shopifyId: orderData.id,
        orderNumber: orderData.order_number,
        totalPrice: orderData.total_price,
        orderDate: orderData.created_at,
        financialStatus: orderData.financial_status,
        customerId: customer?.id,
        tenantId: tenant.id
      });
    }

    res.json({ message: 'Data synced successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Sync failed' });
  }
});

module.exports = router;