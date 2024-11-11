import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/loginForm';
import RegisterForm from './components/RegisterForm';
import ProductDetailPage from './pages/DetailProduct';
import AdminOrderPage from './pages/admin/order/AdminOrderPage';
import { OrderProvider } from './context/orderContext';
import { initMercadoPago } from "@mercadopago/sdk-react";
import ProductPage from './pages/admin/product/ProductPage';
import EditProductPage from './pages/admin/product/EditProductPage';
import NewProductPage from './pages/admin/product/NewProductPage';
import OrderPage from './pages/OrderPage';
import AccountPage from './pages/AccountPage';
import PrivateRoute from './components/PrivateRoute';
import ChangePasswordPage from './pages/ChangePasswordPage';
import { UserProvider } from './context/userContext';

initMercadoPago("APP_USR-e2d33d78-50c6-4ad2-9a57-f8f0a59e7307", { locale: "es-AR" });

const App = () => {
  return (
      <Router>
          <Header />
          <OrderProvider>
          <UserProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/myAccount" element={<AccountPage />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />

                {/* PrivateRoute para proteger la ruta por url */}
                <Route path="/admin/orders" element={<PrivateRoute element={<AdminOrderPage />} />} />
                <Route path="/admin/products" element={<PrivateRoute element={<ProductPage />} />} />
                <Route path="/admin/products/edit/:id" element={<PrivateRoute element={<EditProductPage />} />} />
                <Route path="/admin/products/new" element={<PrivateRoute element={<NewProductPage />} />} />
            </Routes>
          </UserProvider>
          </OrderProvider>
          <Footer />
      </Router>

  );
};

export default App;
