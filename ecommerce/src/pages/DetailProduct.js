import React, { useState,useEffect} from 'react';
import { useCart } from '../context/cartContext';
const ProductDetailPage = () => {
    const { addToCart } = useCart(); // Obtener la función para agregar al carrito
    const [selectedImage, setSelectedImage] = useState(''); // Estado para la imagen seleccionada
    const [quantity, setQuantity] = useState(1); // Estado para la cantidad

    const product = {
        id: 1,
        name: "Aire Acondicionado Inverter 3000W",
        category: "Electrodomésticos",
        description: "Un potente aire acondicionado de bajo consumo con tecnología inverter.",
        price: 35000,
        quantity: 15,
        mainImage:"../product-1.jpeg",
        images: [
            "../product-1.jpeg",
           "../product-2.jpeg",
            "../product-2.jpeg",
            "../product-1.jpeg"
        ]
    };

    // Función para cambiar la imagen seleccionada
    const handleImageClick = (image) => {
        setSelectedImage(image);
    };
       // Usar useEffect para establecer la imagen inicial
       useEffect(() => {
        setSelectedImage(product.mainImage);
    }, [product.mainImage]);

    // Función para manejar el cambio de cantidad
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity); // Agregar el producto al carrito
        console.log(`Agregando ${quantity} unidades de ${product.name} al carrito`);
    };
    
    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                {/* Columna para imágenes */}
                <div className="col-md-6">
                    <div className="mb-3">
                        {/* Imagen principal del producto */}
                        <img
                            src={selectedImage}
                            className="img-fluid"
                            alt={product.name}
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Galería de imágenes adicionales */}
                    <div className="d-flex justify-content-between">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Imagen ${index + 1}`}
                                className="img-thumbnail"
                                onClick={() => handleImageClick(image)}
                                style={{ cursor: 'pointer', maxHeight: '150px', objectFit: 'cover' }}
                            />
                        ))}
                    </div>
                </div>

                {/* Columna para los detalles del producto */}
                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <p className="text-muted">Categoría: {product.category}</p>

                    <p>{product.description}</p>
                    
                    <div className="my-4">
                        {/* Mostrar el stock del producto */}
                        <p className="text-muted">
                            {product.quantity > 0 ? `Stock disponible: ${product.quantity}` : 'Producto agotado'}
                        </p>
                        <h4 className="text-success">${product.price}</h4>
                         {/* Input para seleccionar la cantidad */}
                         <div className="mt-3">
                            <label htmlFor="quantity" className="form-label">Cantidad:</label>
                            <input
                                type="number"
                                id="quantity"
                                className="form-control"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={product.quantity} // Limitar según el stock disponible
                            />
                        </div>
                    </div>
                    

                    {/* Botón para agregar al carrito */}
                    <button className="btn btn-success btn-lg w-100"  onClick={handleAddToCart} >Agregar al carrito</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;