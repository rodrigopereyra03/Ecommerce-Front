import React, { useState } from 'react';
import { useAuth } from '../context/authContext'; // Importar el hook de autenticación

import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LoginForm = () => {
    const { login } = useAuth(); // Obtener la función login del contexto
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica
        if (!email || !password) {
            setError('Por favor, completa ambos campos.');
            return;
        }
        try {
           
            const responseLogin = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!responseLogin.ok) {
                // Manejo de errores en caso de respuesta no exitosa
                const errorData = await responseLogin.json();
                setError('Tuvimos un problema para iniciar sesion. Te redireccionaremos al login');
                return;
            }

            // Convertir la respuesta en JSON
            const data = await responseLogin.json();

            // Acceder al atributo 'jwt' del body
            const jwt = data.jwt;
            login(jwt); 
            // Redireccionar al home después del registro exitoso
            navigate('/');
        }
        catch (error) {
            setError('Tuvimos un problema para iniciar sesion. Te redireccionaremos al login');

        }
        // Aquí podrías manejar el envío del formulario (llamada a la API, autenticación, etc.)
        console.log('Iniciando sesión con:', { email, password });

        // Limpiar error si el formulario es válido
        setError('');
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Ingresá</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Ingresa tu correo"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ingresa tu contraseña"
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100">Iniciar sesión</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
