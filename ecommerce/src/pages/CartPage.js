import React, { useEffect } from 'react';
import { useState } from 'react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/cartContext'; // Asumiendo que el contexto está implementado
import { Wallet } from "@mercadopago/sdk-react";
import { useAuth } from '../context/authContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const CartPage = () => {
    const { cart, setCart } = useCart(); // Obtener el carrito del contexto
    const { token, setToken } = useAuth();
    const [preferenceId, setPreferenceId] = useState();
    const [step, setStep] = useState(1); // Controla el paso actual
    const [formData, setFormData] = useState({
        street: '',
        number: '',
        zipCode: '',
        city: '',
        state: '',
    });

    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id)); // Filtrar los productos que no tienen el id a eliminar
    };

    const renderCheckoutButton = (preferenceId) => {
        if (!preferenceId) return null;
        return (
            <Wallet
                initialization={{ preferenceId: preferenceId, action: 'pay' }}
                customization={{ texts: { valueProp: 'smart_option' } }}
                onReady={true} />
        )
    }

    // Calcular el total del carrito
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    const handleCreateOrder = () => {
        setStep(2); // Avanzar al siguiente paso
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressSubmit = async (event) => {
        event.preventDefault();


        const emptyFields = Object.keys(formData).filter((key) => !formData[key]);
        if (emptyFields.length > 0) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        try {

            const { street, number, zipCode, city, state } = formData;

            const products = cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                name: item.name,
                description: item.description,
                price: item.price
            }));
            const responseOrder = await fetch(`${backendUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    address: {
                        street,
                        number,
                        zipCode,
                        city,
                        state
                    },
                    products: products,
                }),
            });

            try {
                const responsePreference = await fetch(`${backendUrl}/api/mercadopago/create_preference`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({
                        address: {
                            street,
                            number,
                            zipCode,
                            city,
                            state
                        },
                        products: products,
                        documentNumber: 40897248

                    }),
                });
                const responseText = await responsePreference.text();

                setPreferenceId(responseText);

            } catch (error) {
                console.log(error)
            }

        }
        catch (error) {
            console.log(error)

        }

        setStep(3); // Avanzar al paso 3: pago
    };
    const handleTransfers = () => {
        setStep(4); // Avanzar al siguiente paso
    };
    return (
        <div className="container-sm justify-content-center mb-3">

            {/* Step 1: Ver carrito y crear pedido */}
            {step === 1 && (
                <>
                    <h1 className="my-4 text-center">Carrito</h1>

                    {cart.length === 0 ? (
                        <p className="text-center">No hay productos en tu carrito.</p>
                    ) : (
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8 col-lg-6">
                                <div className="card shadow-sm border-0 p-3">
                                    <div className="card-body">
                                        <h4 className="card-title text-center mb-4">Productos en tu carrito</h4>

                                        {cart.map(item => (
                                            <CartItem item={item} key={item.id} onRemove={removeItem} />
                                        ))}

                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <h5 className="fw-bold text-success">Total: ${totalAmount}</h5>
                                            <button
                                                className="btn btn-primary btn-lg"
                                                onClick={handleCreateOrder}
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Step 2: Formulario de dirección de envío */}
            {step === 2 && (

                <div className="address-form px-3">
                    <h4 className="my-4 text-center">Decinos dónde queres recibir el pedido</h4>
                    <form className="row justify-content-center" onSubmit={handleAddressSubmit}>
                        <div className="col-12 col-md-8 col-lg-6">
                            {[
                                { label: "Calle", id: "street", name: "street", type: "text" },
                                { label: "Número", id: "number", name: "number", type: "number" },
                                { label: "Código Postal", id: "postalCode", name: "zipCode", type: "text" },
                                { label: "Provincia", id: "provincia", name: "city", type: "text" },
                                { label: "Localidad", id: "localidad", name: "state", type: "text" }
                            ].map((field) => (
                                <div className="mb-3" key={field.id}>
                                    <label htmlFor={field.id} className="form-label">{field.label}</label>
                                    <input
                                        type={field.type}
                                        className={`form-control ${!formData[field.name] ? 'is-invalid' : ''}`}
                                        id={field.id}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required
                                    />
                                    {!formData[field.name] && <div className="invalid-feedback">Este campo es obligatorio</div>}
                                </div>
                            ))}

                            <div className="d-flex justify-content-between mt-4">
                                <button type="submit" className="btn btn-primary">
                                    Continuar al pago
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() => setStep(1)}
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {step === 3 && (
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h3 className="text-center mb-4">Realizar Pago</h3>

                                <div className="text-center mb-4">
                                    <p className="display-6 fw-bold text-success">Total a pagar: ${totalAmount}</p>
                                    <p className="text-muted">Puedes pagar con transferencia bancaria o a través de MercadoPago</p>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-lg"
                                        onClick={() => setStep(4)}
                                    >
                                        Pagar con transferencia
                                    </button>
                                </div>

                                <div className="text-center mt-3">
                                    {renderCheckoutButton(preferenceId)}
                                </div>

                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setStep(2)} // Volver al formulario de dirección
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h3 className="text-center mb-4">Nuestros datos bancarios</h3>

                                <div className="text-center mb-4">
                                    <p className="display-6 fw-bold text-success">Total a pagar: ${totalAmount}</p>
                                </div>

                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <strong>Alias:</strong> tomas.tomas.tomas
                                    </li>
                                    <li className="list-group-item">
                                        <strong>CBU:</strong> 43587969493745897
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Titular:</strong> Tomas Agustin Pereyra
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Banco:</strong> BBVA
                                    </li>
                                </ul>

                                <p className="mt-4 text-center text-muted">
                                    Realiza la transferencia desde tu banco o billetera virtual y envíanos el comprobante.
                                </p>

                                <div className="d-grid gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-lg"
                                        onClick={handleTransfers}
                                    >
                                        Adjuntar comprobante
                                    </button>
                                </div>

                                <div className="text-center mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setStep(3)} // Volver al formulario de dirección
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;