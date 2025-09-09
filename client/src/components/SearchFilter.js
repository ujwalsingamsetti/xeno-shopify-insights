import React, { useState } from 'react';

const SearchFilter = ({ onSearch, onFilter, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleDateFilter = () => {
    onFilter({ dateRange, status: statusFilter });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    setStatusFilter('');
    onSearch('');
    onFilter({});
  };

  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      <div className="filter-controls">
        <input
          type="date"
          placeholder="Start Date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
          className="filter-input"
        />
        <input
          type="date"
          placeholder="End Date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
          className="filter-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={handleDateFilter} className="filter-btn">Apply</button>
        <button onClick={clearFilters} className="clear-btn">Clear</button>
      </div>
    </div>
  );
};

export default SearchFilter;