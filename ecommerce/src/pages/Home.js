import React from 'react';
import ProductCard from '../components/ProductCard.js';

const Home = () => {
    
const products = [
    {
        id: 1,
        name: 'Producto 1',
        description: 'Descripción del producto 1',
        price: 29.99,
        image: 'url-a-la-imagen-1.jpg'
    },
    {
        id: 2,
        name: 'Producto 2',
        description: 'Descripción del producto 2',
        price: 49.99,
        image: 'url-a-la-imagen-2.jpg'
    },
    // Agrega más productos según sea necesario
];


return (
    <div className="container">
        <h1 className="my-4">Productos</h1>
        <div className="row">
            {products.map(product => (
                <div className="col-md-4" key={product.id}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    </div>
);
};

export default Home;