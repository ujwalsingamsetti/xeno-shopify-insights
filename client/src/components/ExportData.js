import React from 'react';

const ExportData = ({ data, filename, type = 'csv' }) => {
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (type === 'csv') {
      exportToCSV(data, filename);
    } else if (type === 'json') {
      exportToJSON(data, filename);
    }
  };

  return (
    <button onClick={handleExport} className="export-btn">
      Export {type.toUpperCase()}
    </button>
  );
};

export default ExportData;