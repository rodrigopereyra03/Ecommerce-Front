import React from 'react';
import { useState } from 'react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/cartContext'; // Asumiendo que el contexto está implementado

const CartPage = () => {
    const { cart,setCart } = useCart(); // Obtener el carrito del contexto
    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id)); // Filtrar los productos que no tienen el id a eliminar
    };

    // Calcular el total del carrito
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    return (
        <div className="container">
            <h1 className="my-4 text-center">Carrito</h1>
            {cart.length === 0 ? (
                <p className="text-center">No hay productos en tu carrito.</p>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-6">
                        {cart.map(item => (
                            <CartItem item={item} key={item.id} onRemove={removeItem} />
                        ))}
                        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
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