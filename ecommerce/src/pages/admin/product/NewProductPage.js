import React, { useState } from 'react';
import { useProducts } from '../../../context/productContext';

const NewProductPage = () => {
    const { createProduct, loading, error } = useProducts();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        mainImage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newProduct = await createProduct(productData);
            alert(`Producto creado: ${newProduct.name}`);
            setProductData({
                name: '',
                description: '',
                price: '',
                quantity: '',
                mainImage: ''
            });
        } catch (err) {
            console.error('Error al crear el producto:', err);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>CREAR NUEVO PRODUCTO</h1>
            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Descripción:</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        required
                        style={styles.textarea}
                    ></textarea>
                </div>
                <div style={styles.inputGroup}>
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={productData.quantity}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" disabled={loading} style={styles.button}>Crear Producto</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    title: {
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
    },
    textarea: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
        resize: 'vertical',
    },
    button: {
        backgroundColor: '#198754',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default NewProductPage;
