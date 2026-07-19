import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import WorkOrders from './pages/WorkOrders';
import Inventory from './pages/Inventory';
import Maintenance from './pages/Maintenance';
import ProductionLogs from './pages/ProductionLogs';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="machines" element={<Machines />} />
          <Route path="work-orders" element={<WorkOrders />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="production" element={<ProductionLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
