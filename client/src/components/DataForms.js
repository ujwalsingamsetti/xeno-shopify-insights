import React, { useState } from 'react';
import axios from 'axios';

const CustomerForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Customer</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
          <div className="modal-actions">
            <button type="submit">Add Customer</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    vendor: '',
    productType: '',
    inventory: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Product</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({...formData, vendor: e.target.value})}
          />
          <input
            type="text"
            placeholder="Product Type"
            value={formData.productType}
            onChange={(e) => setFormData({...formData, productType: e.target.value})}
          />
          <input
            type="number"
            placeholder="Inventory Count"
            value={formData.inventory}
            onChange={(e) => setFormData({...formData, inventory: e.target.value})}
          />
          <div className="modal-actions">
            <button type="submit">Add Product</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderForm = ({ onSubmit, onClose, customers }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    totalPrice: '',
    orderDate: new Date().toISOString().split('T')[0],
    financialStatus: 'pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Order</h3>
        <form onSubmit={handleSubmit}>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({...formData, customerId: e.target.value})}
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName} ({customer.email})
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Total Price"
            value={formData.totalPrice}
            onChange={(e) => setFormData({...formData, totalPrice: e.target.value})}
            required
          />
          <input
            type="date"
            value={formData.orderDate}
            onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
            required
          />
          <select
            value={formData.financialStatus}
            onChange={(e) => setFormData({...formData, financialStatus: e.target.value})}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="modal-actions">
            <button type="submit">Add Order</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { CustomerForm, ProductForm, OrderForm };