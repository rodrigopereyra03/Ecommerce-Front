import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    
    const [products,setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect para traer los productos del backend cuando el componente se monta
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://vps-4482586-x.dattaweb.com:8080/api/product'); // Cambia por la URL de tu API
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
    return (
        <ProductContext.Provider value={{
            products,
            setProducts,
            filteredProducts,
            setFilteredProducts,
            searchTerm,
            setSearchTerm
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
