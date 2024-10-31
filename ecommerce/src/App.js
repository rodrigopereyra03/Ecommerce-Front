import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/loginForm';
import RegisterForm from './components/RegisterForm';
import ProductDetailPage from './pages/DetailProduct';
import OrderPage from './pages/admin/order/OrderPage';
import { OrderProvider } from './context/orderContext';
import { initMercadoPago } from "@mercadopago/sdk-react";
import ProductPage from './pages/admin/product/ProductPage';
import EditPage from './pages/admin/product/EditPage';

initMercadoPago("APP_USR-e2d33d78-50c6-4ad2-9a57-f8f0a59e7307", { locale: "es-AR" });

const App = () => {
  return (
      <Router>
          <Header />
          <OrderProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/products/edit/:id" element={<EditPage />} />
            </Routes>
          </OrderProvider>
          <Footer />
      </Router>

  );
};

export default App;
