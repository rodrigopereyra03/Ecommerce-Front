import { Link } from 'react-router-dom';
import { useProducts } from '../context/productContext';

const Header = () => {
    const { setSearchTerm, setFilteredProducts, products, searchTerm } = useProducts(); // Obtener funciones del contexto
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



    return (
        <nav className="navbar navbar-expand-lg navbar-light mb-4 bg-light">
            <div className="container-fluid">
                <div className="row w-100">
                    <div className="col-4">
                        <a className="navbar-brand d-flex align-items-center" href="/">
                            {/* Logo */}
                            <img
                                src="logo-recortado.png"
                                alt="Logo"
                                style={{ width: '130px', height: '65px', marginRight: '10px', marginLeft:'10px' }}
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
                    <div className="col-4 mx-auto d-flex align-items-center">
                        <div className="w-100"> {/* Centro horizontalmente */}
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="col-4 ms-auto d-flex align-items-center">
                        <div className="collapse navbar-collapse" id="navbarNav">


                            <ul className="navbar-nav ms-auto"> {/* Alinear a la derecha */}
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/">Productos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">
                                        <i className="bi bi-cart"></i>
                                    </Link>
                                </li>
                                {/* Dropdown para iniciar sesión/registrarse */}
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
                                        <li>
                                            <Link className="dropdown-item" to="/login">Iniciar sesión</Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/register">Registrarse</Link>
                                        </li>
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
