import React, { useEffect } from 'react';
import { useState } from 'react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/cartContext'; // Asumiendo que el contexto está implementado
import { Wallet } from "@mercadopago/sdk-react";
import { useAuth } from '../context/authContext';

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

        try {

            const { street, number, zipCode, city, state } = formData;

            const products = cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                name: item.name,
                description: item.description,
                price: item.price
            }));

            const responseOrder = await fetch('http://localhost:8080/api/orders', {
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

            try {

                const responsePreference = await fetch('http://localhost:8080/api/mercadopago/create_preference', {
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
                            <div className="col-12 col-md-6">
                                {cart.map(item => (
                                    <CartItem item={item} key={item.id} onRemove={removeItem} />
                                ))}
                                <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                                    <h4>Total: ${totalAmount}</h4>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleCreateOrder}
                                    >
                                        Continuar
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Step 2: Formulario de dirección de envío */}
            {step === 2 && (

                <div className="address-form px-3">
                    <h4 className="my-4 text-center">Decinos en donde queres recibir el pedido</h4>
                    <form className="d-flex justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="row mb-3">
                                <label htmlFor="street" className="form-label col-12">Calle</label>

                                <input type="text" className="form-control" id="street" name="street" value={formData.street} onChange={handleChange} required />

                            </div>
                            <div className="row mb-3">
                                <label htmlFor="number" className="form-label col-12">Número</label>

                                <input type="number" className="form-control" id="number" name="number" required value={formData.number} onChange={handleChange} />

                            </div>
                            <div className="row mb-3">
                                <label htmlFor="postalCode" className="form-label col-12">Código Postal</label>

                                <input type="text" className="form-control" id="postalCode" name="zipCode" required value={formData.zipCode} onChange={handleChange} />

                            </div>
                            <div className="row mb-3">
                                <label htmlFor="provincia" className="form-label col-12">Provincia</label>

                                <input type="text" className="form-control" id="provincia" name="city" required value={formData.city} onChange={handleChange} />

                            </div>
                            <div className="row mb-3">
                                <label htmlFor="localidad" className="form-label col-12">Localidad</label>

                                <input type="text" className="form-control" id="localidad" name="state" required value={formData.state} onChange={handleChange} />

                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <button type="submit" className="btn btn-primary" onClick={handleAddressSubmit}>Continuar al pago</button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() => setStep(1)} // Permite volver al paso anterior
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
                        <h3 className="text-center">Realizar Pago</h3>
                        <p>Total a pagar: ${totalAmount}</p>
                        <p>Puedes pagar con transferencia bancaria o a través de MercadoPago</p>

                        <div className="row mt-5 align-items-center">
                            <div className="col-12">
                                <button
                                    type="button"
                                    className="btn btn-success  w-100"
                                    onClick={() => setStep(4)}
                                >
                                    Pagar con transferencia
                                </button>
                            </div>
                        </div>


                        <div className="row mt-3 align-items-center">
                            {/* Columna para el botón de MercadoPago */}
                            <div className="col-12">
                                {renderCheckoutButton(preferenceId)}
                            </div>
                        </div>


                        {/* Fila para el botón "Volver" */}
                        <div className="row mt-3">
                            <div className="col text-center">
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
            )}

            {step === 4 && (
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <h3 className="text-center mb-3">Nuestros datos bancarios</h3>
                        <p>Total a pagar: ${totalAmount}</p>
                        <p>ALIAS : tomas.tomas.tomas</p>
                        <p>CBU : 43587969493745897</p>
                        <p>Titular : Tomas agustin Pereyra</p>
                        <p>Banco : BBVA</p>

                        <div className="row mt-5 align-items-center">
                            <div className="col-12">
                                <button
                                    type="button"
                                    className="btn btn-success  w-100"
                                    onClick={handleTransfers}
                                >
                                    Adjuntar comprobante
                                </button>
                            </div>
                        </div>

                        {/* Fila para el botón "Volver" */}
                        <div className="row mt-3">
                            <div className="col text-center">
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
            )}
        </div>
    );
};

export default CartPage;