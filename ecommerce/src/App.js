import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/loginForm';
import RegisterForm from './components/RegisterForm';
import ProductDetailPage from './pages/DetailProduct';
import OrderPage from './pages/OrderPage';

const App = () => {
  return (
      <Router>
          <Header />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/orders" element={<OrderPage />} />
          </Routes>
          <Footer />
      </Router>

  );
};

export default App;
