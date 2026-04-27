
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { MaterialsStore } from './pages/MaterialsStore';
import { ProductSalesPage } from './pages/ProductSalesPage';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/materiais" element={<MaterialsStore />} />
          <Route path="/materiais/:id" element={<ProductSalesPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:tab" element={<Admin />} />
          <Route path="/admin/:tab/:id" element={<Admin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
