import React from 'react';


const ProductCard = ({ product }) => {
    return (
        <div className="card mb-4 shadow-sm">
            <img src={product.image} className="card-img-top" alt={product.name} />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">${product.price}</span>
                    <button className="btn btn-primary">Agregar al carrito</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;