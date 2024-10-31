import React, { useEffect, useState } from 'react';
import { useProducts } from '../../../context/productContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditPage = () => {
    const { getProductById, updateProduct } = useProducts();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                setProduct(productData);
            } catch (error) {
                setError('Error al cargar el producto');
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]); // Evita dependencias innecesarias para prevenir loops

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === 'quantity' ? parseInt(value) : value,
        }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        setProduct((prevProduct) => ({
            ...prevProduct,
            mainImage: file ? file.name : null, // Guarda solo el nombre del archivo
        }));
    };
    
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const imageNames = files.map(file => file.name); // Guarda solo los nombres de archivos
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: imageNames,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedProduct = {
                ...product,
                mainImage: product.mainImage, // Solo el nombre del archivo
                images: product.images, // Nombres de los archivos adicionales
            };
    
            // Envía solo el nombre de la imagen principal y de las imágenes adicionales
            await updateProduct(updatedProduct);
            navigate('/products');
        } catch (error) {
            setError('Error al actualizar el producto');
            console.error('Error updating product:', error);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>EDITAR PRODUCTO</h1>
            {product && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="name">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="description">Descripción:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            required
                            style={styles.textarea}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="quantity">Cantidad:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="price">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="mainImage">Imagen Principal:</label>
                        <input
                            type="file"
                            id="mainImage"
                            name="mainImage"
                            accept="image/*"
                            onChange={handleMainImageChange}
                        />
                        {product.mainImage && <p>Imagen actual: {product.mainImage}</p>} {/* Muestra la imagen actual */}
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="images">Imágenes Adicionales:</label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                        />
                        {product.images && product.images.length > 0 && (
                            <div>
                                <p>Imágenes actuales:</p>
                                <ul>
                                    {product.images.map((imageName, index) => (
                                        <li key={index}>{imageName}</li> // Muestra los nombres de las imágenes actuales
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button type="submit" style={styles.button}>Actualizar Producto</button>
                </form>
            )}
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
        maxWidth: '400px', // Limita el ancho del formulario
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
        resize: 'vertical', // Permite cambiar el tamaño verticalmente
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

export default EditPage;
