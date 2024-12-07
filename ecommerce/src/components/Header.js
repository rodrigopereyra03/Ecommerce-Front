import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProducts } from '../context/productContext';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';

import { useNavigate } from 'react-router-dom';

const Header = () => {

    const location = useLocation();

    const { logout } = useAuth(); 
    const navigate = useNavigate();
    const { setSearchTerm, setFilteredProducts, products, searchTerm } = useProducts(); // Obtener funciones del contexto
    const { cart } = useCart();
    const handleSearch = (event) => {
        const term = event.target.value;

        console.log(event.target.value)
        setSearchTerm(term);
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(term.toLowerCase())
        );

        console.log(filtered)
        setFilteredProducts(filtered);
    };

    const handleLogout = () => {
      
        logout();  
        navigate('/');
    };

    // Verificar si el usuario está logueado
    const isLoggedIn = !!localStorage.getItem('token'); // Devuelve true si hay token, false si no
    const userRole = localStorage.getItem('userRole'); // Devuelve el rol del usuario logeado

    const totalItems = (cart || []).reduce((total, item) => total + item.quantity, 0);


    return (
        <nav className="navbar navbar-expand-lg navbar-light mb-4 bg-light">
            <div className="container-fluid">
                <div className="row w-100">
                    <div className="col-12 col-md-6 col-lg-4 mx-auto d-flex justify-content-between align-items-center">
                        <a className="navbar-brand d-flex align-items-center" href="/">
                            {/* Logo */}
                            <img
                                src="logo-recortado.png"
                                alt="Logo"
                                style={{ width: '130px', height: '65px', marginRight: '10px', marginLeft: '10px' }}
                            />
                        </a>

                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    {location.pathname === '/' && (
                        <div className="col-12 col-md-6 col-lg-4 mx-auto d-flex align-items-center">
                            <div className="w-100">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    )}
                    <div className="col-12 col-md-6 col-lg-4 ms-auto d-flex align-items-center">
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item border-bottom"> {/* Línea divisora */}
                                    <Link className="nav-link active" aria-current="page" to="/">Productos</Link>
                                </li>
                                {/* Mostrar el botón de ordenes solo si el usuario está logueado y es ADMIN */}
                                {isLoggedIn && userRole === 'ADMIN' && (
                                    <li className="nav-item border-bottom"> {/* Línea divisora */}
                                        <Link className="nav-link active" aria-current="page" to="/orders">Ordenes</Link>
                                    </li>
                                )}
                                <li className="nav-item position-relative border-bottom">
                                    <Link className="nav-link" to="/cart">
                                        {totalItems > 0 ? (
                                            <i className="bi bi-cart-fill"></i>
                                        ) : (
                                            <i className="bi bi-cart"></i>
                                        )}
                                        {totalItems > 0 && (
                                            <span className="badge bg-danger position-absolute top-0 start-75 translate-middle p-1" style={{ fontSize: '0.75rem' }}>
                                                {totalItems}
                                            </span>
                                        )}
                                    </Link>
                                </li>

                                <li className="nav-item dropdown border-bottom"> {/* Línea divisora */}
                                    <a
                                        className="nav-link dropdown-toggle"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-person"></i>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        {isLoggedIn ? (
                                            <>
                                             <li>
                                                <button className="dropdown-item">Mi cuenta</button>
                                            </li>
                                             <li>
                                                <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                                            </li>
                                            </>
                        
                                        ) : (
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" to="/login">Iniciar sesión</Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to="/register">Registrarse</Link>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
