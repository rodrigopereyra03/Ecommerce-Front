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

    const handleMyOrders = () => {
        navigate('/orders');
    }

    const handleMyAccount = () => {
        navigate('/my-account');
    }

    const handleLogout = () => {

        logout();
        navigate('/');
    };

    // Verificar si el usuario está logueado
    const isLoggedIn = !!localStorage.getItem('token'); // Devuelve true si hay token, false si no
    const userRole = localStorage.getItem('userRole'); // Devuelve el rol del usuario logeado

    const totalItems = (cart || []).reduce((total, item) => total + item.quantity, 0);


    return (
        <nav className="navbar navbar-expand-lg navbar-light mb-4" style={{ backgroundColor: '#f8f9fa', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div className="container-fluid">
                <div className="row w-100">
                    <div className="col-12 col-md-6 col-lg-4 mx-auto d-flex justify-content-between align-items-center">
                        <a className="navbar-brand d-flex align-items-center" href="/">
                     
                            <img
                                src="logo-recortado.png"  // Logo para pantallas grandes
                                alt="Logo Grande"
                                className="d-none d-lg-block"  // Ocultar en pantallas pequeñas
                                style={{ width: '130px', height: '65px' }}
                            />

                            <img
                                src="project_20240920_1534178-02.jpg"  // Logo para pantallas pequeñas
                                alt="Logo Pequeño"
                                className="d-block d-lg-none"  // Mostrar en pantallas pequeñas
                                style={{ width: '65px', height: '65px' }}
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
                                    className="form-control rounded-pill border-0 shadow-sm"
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
                                <li className="nav-item">
                                    <Link className="nav-link active fw-bold" to="/">Inicio</Link>
                                </li>
                                {isLoggedIn && userRole === 'ADMIN' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin/orders">Órdenes</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin/products">Productos</Link>
                                        </li>
                                    </>
                                )}
                                <li className="nav-item position-relative">
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

                                <li className="nav-item dropdown">
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
                                                    <button className="dropdown-item" onClick={handleMyAccount}>Mis datos</button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={handleMyOrders}>Mis pedidos</button>
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
