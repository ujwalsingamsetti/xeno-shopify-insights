const validateCustomer = (req, res, next) => {
  const { email, firstName, lastName } = req.body;
  
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: 'Email, first name, and last name are required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  next();
};

const validateProduct = (req, res, next) => {
  const { title, price } = req.body;
  
  if (!title || !price) {
    return res.status(400).json({ message: 'Title and price are required' });
  }
  
  if (isNaN(price) || parseFloat(price) < 0) {
    return res.status(400).json({ message: 'Price must be a valid positive number' });
  }
  
  next();
};

const validateOrder = (req, res, next) => {
  const { totalPrice, orderDate } = req.body;
  
  if (!totalPrice || !orderDate) {
    return res.status(400).json({ message: 'Total price and order date are required' });
  }
  
  if (isNaN(totalPrice) || parseFloat(totalPrice) < 0) {
    return res.status(400).json({ message: 'Total price must be a valid positive number' });
  }
  
  next();
};

module.exports = { validateCustomer, validateProduct, validateOrder };