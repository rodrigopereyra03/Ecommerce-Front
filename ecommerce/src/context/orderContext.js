// OrderContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({});

    // Función para obtener ordenes
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendUrl}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error al obtener las ordenes:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        setStatusUpdates((prev) => ({
            ...prev,
            [orderId]: newStatus,
        }));
    
        // Actualiza la orden en la lista de ordenes
        setOrders((prevOrders) => 
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const updateOrderStatus = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${backendUrl}/api/orders/${orderId}/status`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    status: statusUpdates[orderId],
                },
            });

            const updatedOrders = orders.map((order) => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        status: statusUpdates[orderId],
                    };
                }
                return order;
            });
            setOrders(updatedOrders);
            alert('Estado actualizado');
        } catch (error) {
            console.error('Error al actualizar el estado de la orden:', error);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, handleStatusChange, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};
