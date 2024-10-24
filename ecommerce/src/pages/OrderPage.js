import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({}); // Para almacenar los nuevos estados

    // Paginación
    const itemsPerPage = 8; // Número de órdenes por página
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error al obtener las órdenes:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        setStatusUpdates((prev) => ({
            ...prev,
            [orderId]: newStatus,
        }));
    };

    const updateOrderStatus = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    status: statusUpdates[orderId], // Solo el nuevo estado de la orden específica
                },
            });

            // Actualiza las órdenes después de la actualización
            const updatedOrders = orders.map((order) => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        status: statusUpdates[orderId], // Actualiza el estado localmente
                    };
                }
                return order;
            });
            setOrders(updatedOrders);

            // Muestra la alerta de éxito
            alert('Estado actualizado');
        } catch (error) {
            console.error('Error al actualizar el estado de la orden:', error);
        }
    };

    // Obtener las órdenes de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    // Función para cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
            <div style={{ width: '80%', overflowX: 'auto' }}>
                <h1 style={{ textAlign: 'center' }}>Órdenes</h1>
                {currentOrders.length > 0 ? (
                    <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>FECHA</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>PRODUCTOS</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>DIRECCIÓN</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>TOTAL</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>ESTADO</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{order.id}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(order.dateCreated).toLocaleDateString()}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        {order.products.map(product => (
                                            <div key={product.id}>
                                                {product.name} (x{product.quantity})
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        {order.address.street} {order.address.number}, {order.address.city}, {order.address.state}
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>${order.amount}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <select 
                                            value={statusUpdates[order.id] || order.status} 
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="CREATED">CREADO</option>
                                            <option value="PAID">PAGADO</option>
                                            <option value="FINISHED">FINALIZADO</option>
                                        </select>
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <button onClick={() => updateOrderStatus(order.id)}>Actualizar Estado</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay órdenes disponibles</p>
                )}
                {/* Paginación */}
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                Anterior
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                Siguiente
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default OrderPage;
