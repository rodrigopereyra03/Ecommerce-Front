import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; 
const RegisterForm = () => {
    const { login } = useAuth(); 
    const [formData, setFormData] = useState({
        name: '',
        lastName:'',
        documentNumber:'',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
 
    });

    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // Controla el paso del formulario
    const navigate = useNavigate();
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name,lastName,documentNumber, email, password, confirmPassword, address, city, state, zip } = formData;

        if (step === 1) {
            // Validación básica para la primera parte del formulario
            if (!name || !email || !password || !confirmPassword || !lastName || !documentNumber) {
                setError('Por favor, completa todos los campos.');
                return;
            }

            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }

            setError('');
            setStep(2); // Ir a la segunda parte del formulario
        } else if (step === 2) {
            // Validación para la segunda parte (dirección)
           /* if (!address || !city || !state || !zip) {
                setError('Por favor, completa toda la información de la dirección.');
                return;
            }*/

            setError('');

        // Enviar los datos al backend
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    lastName,
                    documentNumber,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                // Manejo de errores en caso de respuesta no exitosa
                const errorData = await response.json();
                setError(errorData.message || 'Error en el registro');
                return;
            }
            try{
                const responseLogin = await fetch('http://localhost:8080/api/auth/login', {
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
                console.log(responseLogin.body)
                login(responseLogin.body.jwt);

                 // Redireccionar al home después del registro exitoso
                 navigate('/');
            }
            catch(error) {
                setError('Tuvimos un problema para iniciar sesion. Te redireccionaremos al login');
              
            }
            
    
            // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
        } catch (error) {
            setError('Error al conectar con el servidor. Inténtalo nuevamente más tarde.');
          
        }

     
            // Aquí manejarías el envío completo del formulario
            console.log('Datos completos del usuario:', formData);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">
                                {step === 1 ? 'Tus datos' : 'Tu direccion'}
                            </h3>
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                {step === 1 ? (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Nombre</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="name" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleChange} 
                                                placeholder="Ingresa tu nombre"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Apellido</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="lastName" 
                                                name="lastName" 
                                                value={formData.lastName} 
                                                onChange={handleChange} 
                                                placeholder="Ingresa tu apellido"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Numero de documento</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                id="documentNumber" 
                                                name="documentNumber" 
                                                value={formData.documentNumber} 
                                                onChange={handleChange} 
                                                placeholder="Ingresa tu numero de documento"
                                            />
                                        </div>
                                        <hr />
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                name="email" 
                                                value={formData.email} 
                                                onChange={handleChange} 
                                                placeholder="Ingresa tu correo"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Contraseña</label>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                id="password" 
                                                name="password" 
                                                value={formData.password} 
                                                onChange={handleChange} 
                                                placeholder="Crea una contraseña"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                id="confirmPassword" 
                                                name="confirmPassword" 
                                                value={formData.confirmPassword} 
                                                onChange={handleChange} 
                                                placeholder="Repite la contraseña"
                                            />
                                        </div>
                                        <button type="button" onClick={handleSubmit} className="btn btn-primary w-100">
                                            Siguiente
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="address" className="form-label">Dirección</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="address" 
                                                name="address" 
                                                value={formData.address} 
                                                onChange={handleChange} 
                                                placeholder="Ingresa tu dirección"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="city" className="form-label">Ciudad</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="city" 
                                                name="city" 
                                                value={formData.city} 
                                                onChange={handleChange} 
                                                placeholder="Ingresa tu ciudad"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="state" className="form-label">Provincia/Estado</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="state" 
                                                name="state" 
                                                value={formData.state} 
                                                onChange={handleChange} 
                                                placeholder="Ingresa tu provincia o estado"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="zip" className="form-label">Código postal</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="zip" 
                                                name="zip" 
                                                value={formData.zip} 
                                                onChange={handleChange} 
                                                placeholder="Ingresa tu código postal"
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-success w-100">
                                            Registrarme
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(1)} 
                                            className="btn btn-secondary w-100 mt-2"
                                        >
                                            Volver
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
