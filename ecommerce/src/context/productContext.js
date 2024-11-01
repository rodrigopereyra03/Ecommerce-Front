import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    
    const [products,setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const [error, setError] = useState(null); // Para manejar errores

    // useEffect para traer los productos del backend cuando el componente se monta
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/product`); // Cambia por la URL de tu API
                const data = await response.json();
                console.log(data)
                setProducts(data); // Almacena los productos traídos del backend
                setFilteredProducts(data); // Inicialmente, todos los productos se muestran
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts(); // Llamada a la función
    }, []); // Este efecto se ejecuta solo una vez cuando el componente se monta  
   // Actualizar los productos filtrados cuando el término de búsqueda cambia
   useEffect(() => {
    if (searchTerm === '') {
        // Si no hay término de búsqueda, mostrar todos los productos
        setFilteredProducts(products);
    } else {
        // Si hay término de búsqueda, filtrar los productos
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }
}, [searchTerm, products]);

 // Función para obtener un producto por su ID
 const getProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // Retorna el producto encontrado
    } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error al cargar el producto.');
    } finally {
        setLoading(false);
    }
};

// Función para actualizar un producto
const updateProduct = async (productDto) => {
    setLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${backendUrl}/api/product`, productDto, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Actualiza el producto en el estado
        setProducts(prevProducts => 
            prevProducts.map(product => 
                product.id === response.data.id ? response.data : product
            )
        ); 
        return response.data; // Retorna el producto actualizado
    } catch (error) {
        console.error('Error updating product:', error);
        setError('Error al actualizar el producto.');
    } finally {
        setLoading(false);
    }
};

// Función para crear un producto
const createProduct = async (productDto) => {
    setLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/product`, productDto, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Agrega el nuevo producto al estado
        setProducts(prevProducts => [...prevProducts, response.data]);
        setFilteredProducts(prevFiltered => [...prevFiltered, response.data]);
        
        return response.data; // Retorna el producto creado
    } catch (error) {
        console.error('Error creating product:', error);
        setError('Error al crear el producto.');
    } finally {
        setLoading(false);
    }
};

// Nueva función para eliminar un producto
const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${backendUrl}/api/product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Actualiza el estado de los productos después de la eliminación
        setProducts(prevProducts => 
            prevProducts.filter(product => product.id !== id)
        );
        setFilteredProducts(prevFilteredProducts => 
            prevFilteredProducts.filter(product => product.id !== id)
        );
    } catch (error) {
        console.error('Error deleting product:', error);
        setError('Error al eliminar el producto.');
    } finally {
        setLoading(false);
    }
};

    return (
        <ProductContext.Provider value={{
            products,
            setProducts,
            filteredProducts,
            setFilteredProducts,
            searchTerm,
            setSearchTerm,
            loading,
            error,
            getProductById,
            updateProduct,
            createProduct,
            deleteProduct
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
