import React from 'react';


const ProductCard = ({ product }) => {
    return (
        <div className="card mb-4 shadow-sm" style={{ width: '16rem' }} >
            <img src={product.image} className="card-img-top" alt={product.name} style={{ height: '8rem', objectFit: 'cover' }}/>
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="mt-2 text-muted">
                    {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Producto agotado'}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">${product.price}</span>
                    <button className="btn btn-success">Comprar</button>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
