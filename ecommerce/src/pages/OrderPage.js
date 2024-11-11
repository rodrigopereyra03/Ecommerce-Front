import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useSpinner } from '../context/spinnerContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { showSpinner, hideSpinner } = useSpinner();

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        showSpinner();
        const response = await fetch(`${backendUrl}/api/user/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al cargar las órdenes');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError('Error al cargar las órdenes');
      }
      finally {
        hideSpinner();
      }
    };

    fetchOrders();
  }, []);
  const getFriendlyStatus = ((status) => {
    switch (status) {
      case 'CREATED':
        return 'Creada';
      case 'IN_REVIEW':
        return 'Estamos comprobando el pago';
      case 'PAID':
        return 'Pagada';
      case 'FINISHED':
        return 'Finalizada';
      default:
        return 'Desconocido';
    }
  })

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Mis Pedidos</h2>
      <div className="row">
        {orders.map((order) => (
          <div key={order.id} className="col-12 col-md-6 col-lg-4 mb-4 d-flex">
            <Card className="shadow-sm border-0 w-100" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
              <Card.Header className="bg-primary text-white">
                Pedido #{order.id}
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-success">Total: ${order.amount.toFixed(2)}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Fecha: {new Date(order.dateCreated).toLocaleDateString()}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Dirección:</strong>{' '}
                  {order.address ? (
                    <>
                      {order.address.street} {order.address.number}, {order.address.state}, {order.address.city}
                    </>
                  ) : (
                    'Sin dirección'
                  )}
                </Card.Text>
                <Card.Text>
                  <strong>Productos:</strong>
                  <ul className="ps-3">
                    {order.products.map((product, index) => (
                      <li key={index}>
                        {product.name} (x{product.quantity})
                      </li>
                    ))}
                  </ul>
                </Card.Text>
                <Card.Text className="mt-auto">
                  <strong>Estado:</strong> <span className="text">{getFriendlyStatus(order.status)}</span>
                </Card.Text>
                <div className="text-center mt-3">
                  {order.comprobanteUrl ? (
                    <Button variant="outline-primary" href={order.comprobanteUrl} target="_blank" rel="noopener noreferrer">
                      Ver Comprobante
                    </Button>
                  ) : (
                    <span className="text-muted">Comprobante no disponible</span>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
