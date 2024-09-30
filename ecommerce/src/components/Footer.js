import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start mt-auto">
            <div className="text-center p-3">
                <span className="text-dark" >&copy; {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.</span>
                <br />
                <a href="/privacy" className="text-dark">Política de privacidad</a> | 
                <a href="/terms" className="text-dark"> Términos de servicio</a>
                <br />
                <br />
                <a href="https://facebook.com" className="text-dark" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-facebook"></i>
                </a>
                <a href="https://twitter.com" className="text-dark" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-twitter"></i>
                </a>
                <a href="https://instagram.com" className="text-dark" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-instagram"></i>
                </a>
            </div>
        </footer>
    );
};


export default Footer;
