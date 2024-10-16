import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProductProvider } from './context/productContext';
import './index.css';
import './styles/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './context/cartContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
  <ProductProvider>
    
    <App />
    </ProductProvider>
    </CartProvider>,
);

