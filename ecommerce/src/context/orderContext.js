// OrderContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useSpinner } from './spinnerContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
export const OrderContext = createContext();


export const OrderProvider = ({ children }) => {
    const { showSpinner, hideSpinner } = useSpinner();

    const [orders, setOrders] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({});
    // Función para obtener ordenes usando fetch
    const fetchOrders = async () => {
        try {
            showSpinner();
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/orders`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error al obtener las ordenes:', error);
        }
        finally {
            hideSpinner();
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
            //aca aparece como si no se llama
                try {
                    showSpinner();
                    const token = localStorage.getItem('token');
                    const status = statusUpdates[orderId];
            
                    const response = await fetch(`${backendUrl}/api/orders/${orderId}/status?status=${status}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(null) // `fetch` requiere un cuerpo explícito en `PUT`, aunque sea null
                    });
            
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
            
                    const data = await response.json();
                    console.log("Order status updated:", data);
                } catch (error) {
                    console.error('Error updating order status:', error);
                }
                finally {
                    hideSpinner();
                }
       
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
        <OrderContext.Provider value={{ orders, handleStatusChange, updateOrderStatus, fetchOrders }}>
            {children}
        </OrderContext.Provider>
    );
};
