import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer = () => {
    return (
        <footer className="bg-dark text-center text-lg-start mt-auto">
            <div className="text-center p-3">
                <span className="text-white" >&copy; {new Date().getFullYear()} CasasFrioCalor. Todos los derechos reservados.</span>
                <br />
                <a href="/privacy" className="text-white">Política de privacidad</a> | 
                <a href="/terms" className="text-white"> Términos de servicio</a>
                <br />
                <br />
                <a href="https://facebook.com" className="text-white m-1" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-facebook"></i>
                </a>
                <a href="https://twitter.com" className="text-white m-1" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-twitter"></i>
                </a>
                <a href="https://instagram.com" className="text-white m-1" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-instagram"></i>
                </a>
            </div>
        </footer>
    );
};


export default Footer;
