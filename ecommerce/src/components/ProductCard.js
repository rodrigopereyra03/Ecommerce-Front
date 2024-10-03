import React from 'react';


const ProductCard = ({ product }) => {
    return (
        <div className="card mb-4 shadow-sm" style={{ width: '16rem' }}>
        <img src={product.image} className="card-img-top" alt={product.name} style={{ height: '12rem', objectFit: 'cover' }} />
        <div className="card-body d-flex flex-column" style={{ height: '100%' }}>
            <h5 className="card-title">{product.name}</h5>
            <p class="card-text"><small class="text-muted">{product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Producto agotado'}</small></p>
     
            <pre className="card-text font">{product.description}</pre>
            <div className="d-flex justify-content-between align-items-center mt-auto">
                <span className="text-muted">${product.price}</span>
                <button className="btn btn-success">Comprar</button>
            </div>
        </div>
    </div>
    );
};
export default ProductCard;
