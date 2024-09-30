import React from 'react';
import { useState } from 'react';
import CartItem from '../components/CartItem';

const CartPage = () => {
    // Ejemplo de productos en el carrito
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Producto 1',
            price: 29.99,
            quantity: 2,
            image: 'url-a-la-imagen-1.jpg'
        },
        {
            id: 2,
            name: 'Producto 2',
            price: 49.99,
            quantity: 1,
            image: 'url-a-la-imagen-2.jpg'
        },
        // Agrega más productos si es necesario
    ]);

    // Calcular el total del carrito
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    return (
        <div className="container">
            <h1 className="my-4 text-center">Carrito</h1>
            {cartItems.length === 0 ? (
                <p className="text-center">No hay productos en tu carrito.</p>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-6">
                        {cartItems.map(item => (
                            <CartItem item={item} key={item.id} />
                        ))}
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <h4>Total: ${totalAmount}</h4>
                            <button className="btn btn-success">Proceder al Pago</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;