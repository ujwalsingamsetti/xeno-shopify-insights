const { Customer, Product, Order } = require('./models');

const seedInitialData = async (tenantId) => {
  try {
    // Check if data already exists
    const existingCustomers = await Customer.count({ where: { tenantId } });
    if (existingCustomers > 0) return;

    // Create sample customers
    const customers = await Customer.bulkCreate([
      {
        shopifyId: 'seed_1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        totalSpent: 150.00,
        ordersCount: 2,
        tenantId
      },
      {
        shopifyId: 'seed_2',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        totalSpent: 300.00,
        ordersCount: 3,
        tenantId
      }
    ]);

    // Create sample products
    await Product.bulkCreate([
      {
        shopifyId: 'prod_1',
        title: 'Sample T-Shirt',
        price: 25.00,
        vendor: 'Fashion Co',
        productType: 'Apparel',
        inventory: 100,
        tenantId
      },
      {
        shopifyId: 'prod_2',
        title: 'Sample Jeans',
        price: 75.00,
        vendor: 'Denim Brand',
        productType: 'Apparel',
        inventory: 50,
        tenantId
      }
    ]);

    // Create sample orders
    await Order.bulkCreate([
      {
        shopifyId: 'order_1',
        orderNumber: 'ORD-001',
        totalPrice: 75.00,
        orderDate: new Date(),
        financialStatus: 'paid',
        customerId: customers[0].id,
        tenantId
      },
      {
        shopifyId: 'order_2',
        orderNumber: 'ORD-002',
        totalPrice: 150.00,
        orderDate: new Date(Date.now() - 86400000), // Yesterday
        financialStatus: 'paid',
        customerId: customers[1].id,
        tenantId
      }
    ]);

    console.log(`Seeded initial data for tenant ${tenantId}`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = { seedInitialData };