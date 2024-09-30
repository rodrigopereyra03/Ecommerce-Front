import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
      <Router>
          <Header />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
          </Routes>
          <Footer />
      </Router>

  );
};

export default App;
