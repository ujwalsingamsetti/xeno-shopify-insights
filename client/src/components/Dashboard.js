import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CustomerForm, ProductForm, OrderForm } from './DataForms';
import SearchFilter from './SearchFilter';
import ExportData from './ExportData';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from './Toast';

const Dashboard = ({ user, onLogout }) => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', shopifyDomain: '', shopifyAccessToken: '' });
  const { showToast, ToastContainer } = useToast();

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTenants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTenant) {
      fetchDashboardData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTenant]);

  const fetchTenants = async () => {
    try {
      const response = await axios.get('/api/shopify/tenants', axiosConfig);
      setTenants(response.data);
      if (response.data.length > 0 && !selectedTenant) {
        setSelectedTenant(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, ordersRes, customersRes, productsRes, topCustomersRes, trendRes] = await Promise.all([
        axios.get(`/api/insights/dashboard/${selectedTenant.id}`, axiosConfig),
        axios.get(`/api/insights/orders/${selectedTenant.id}`, axiosConfig),
        axios.get(`/api/data/customers/${selectedTenant.id}`, axiosConfig),
        axios.get(`/api/data/products/${selectedTenant.id}`, axiosConfig),
        axios.get(`/api/insights/top-customers/${selectedTenant.id}`, axiosConfig),
        axios.get(`/api/insights/revenue-trend/${selectedTenant.id}`, axiosConfig)
      ]);

      setMetrics(metricsRes.data);
      setOrders(ordersRes.data);
      setAllOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
      setTopCustomers(topCustomersRes.data);
      setRevenueTrend(trendRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addTenant = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/shopify/tenant', newTenant, axiosConfig);
      setNewTenant({ name: '', shopifyDomain: '', shopifyAccessToken: '' });
      setShowAddTenant(false);
      fetchTenants();
    } catch (error) {
      console.error('Error adding tenant:', error);
    }
  };

  const syncData = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/shopify/sync/${selectedTenant.id}`, {}, axiosConfig);
      await fetchDashboardData();
      showToast('Data synced successfully!', 'success');
    } catch (error) {
      console.error('Error syncing data:', error);
      showToast('Sync failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (customerData) => {
    try {
      await axios.post(`/api/data/customers/${selectedTenant.id}`, customerData, axiosConfig);
      fetchDashboardData();
      showToast('Customer added successfully!', 'success');
    } catch (error) {
      showToast('Error adding customer', 'error');
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await axios.post(`/api/data/products/${selectedTenant.id}`, productData, axiosConfig);
      fetchDashboardData();
      showToast('Product added successfully!', 'success');
    } catch (error) {
      showToast('Error adding product', 'error');
    }
  };

  const handleAddOrder = async (orderData) => {
    try {
      await axios.post(`/api/data/orders/${selectedTenant.id}`, orderData, axiosConfig);
      fetchDashboardData();
      showToast('Order added successfully!', 'success');
    } catch (error) {
      showToast('Error adding order', 'error');
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setOrders(allOrders);
      return;
    }
    const filtered = allOrders.filter(order => 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.Customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.Customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.Customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOrders(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...allOrders];
    
    if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= new Date(filters.dateRange.startDate) && 
               orderDate <= new Date(filters.dateRange.endDate);
      });
    }
    
    if (filters.status) {
      filtered = filtered.filter(order => order.financialStatus === filters.status);
    }
    
    setOrders(filtered);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Xeno Shopify Insights</h1>
        <div className="header-actions">
          <select 
            value={selectedTenant?.id || ''} 
            onChange={(e) => setSelectedTenant(tenants.find(t => t.id === parseInt(e.target.value)))}
          >
            <option value="">Select Store</option>
            {tenants.map(tenant => (
              <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
            ))}
          </select>
          <button onClick={() => setShowAddTenant(true)}>Add Store</button>
          {selectedTenant && (
            <>
              <button onClick={() => setShowCustomerForm(true)}>Add Customer</button>
              <button onClick={() => setShowProductForm(true)}>Add Product</button>
              <button onClick={() => setShowOrderForm(true)}>Add Order</button>
              <button onClick={syncData} disabled={loading}>Sync Data</button>
            </>
          )}
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      {showAddTenant && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Shopify Store</h3>
            <form onSubmit={addTenant}>
              <input
                type="text"
                placeholder="Store Name"
                value={newTenant.name}
                onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Shopify Domain (e.g., mystore.myshopify.com)"
                value={newTenant.shopifyDomain}
                onChange={(e) => setNewTenant({...newTenant, shopifyDomain: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Access Token (optional for demo)"
                value={newTenant.shopifyAccessToken}
                onChange={(e) => setNewTenant({...newTenant, shopifyAccessToken: e.target.value})}
              />
              <div className="modal-actions">
                <button type="submit">Add Store</button>
                <button type="button" onClick={() => setShowAddTenant(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTenant && (
        <div className="dashboard-content">
          {loading && <LoadingSpinner />}
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Customers</h3>
              <p className="metric-value">{metrics.totalCustomers || 0}</p>
            </div>
            <div className="metric-card">
              <h3>Total Orders</h3>
              <p className="metric-value">{metrics.totalOrders || 0}</p>
            </div>
            <div className="metric-card">
              <h3>Total Revenue</h3>
              <p className="metric-value">${metrics.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="metric-card">
              <h3>Total Products</h3>
              <p className="metric-value">{metrics.totalProducts || 0}</p>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Revenue Trend (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Top 5 Customers by Spend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCustomers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="firstName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalSpent" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="orders-table">
            <div className="table-header">
              <h3>Recent Orders</h3>
              <div className="table-actions">
                <ExportData data={orders} filename="orders" type="csv" />
                <ExportData data={orders} filename="orders" type="json" />
              </div>
            </div>
            <SearchFilter 
              onSearch={handleSearch}
              onFilter={handleFilter}
              placeholder="Search orders, customers..."
            />
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.Customer ? `${order.Customer.firstName} ${order.Customer.lastName}` : 'N/A'}</td>
                    <td>${parseFloat(order.totalPrice).toFixed(2)}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.financialStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {showCustomerForm && (
        <CustomerForm 
          onSubmit={handleAddCustomer}
          onClose={() => setShowCustomerForm(false)}
        />
      )}
      
      {showProductForm && (
        <ProductForm 
          onSubmit={handleAddProduct}
          onClose={() => setShowProductForm(false)}
        />
      )}
      
      {showOrderForm && (
        <OrderForm 
          onSubmit={handleAddOrder}
          onClose={() => setShowOrderForm(false)}
          customers={customers}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

export default Dashboard;