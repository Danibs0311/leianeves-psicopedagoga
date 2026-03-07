
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { MaterialsStore } from './pages/MaterialsStore';
import { ProductSalesPage } from './pages/ProductSalesPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materiais" element={<MaterialsStore />} />
          <Route path="/materiais/:id" element={<ProductSalesPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
