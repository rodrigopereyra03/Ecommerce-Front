// src/context/userContext.js

import React, { createContext, useContext, useState } from 'react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Aquí puedes manejar el usuario si lo necesitas

    const changePassword = async (email, contrasenaActual, contrasenaNueva, confirmaNuevaContrasena) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/user/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email,
                    contrasenaActual,
                    contrasenaNueva,
                    confirmaNuevaContrasena,
                }),
            });

    
             // Aquí verificamos el tipo de respuesta
            const contentType = response.headers.get('content-type');
            const data = contentType && contentType.includes('application/json')
            ? await response.json()
            : await response.text();
            
            return data; // Devuelve la respuesta del backend
        } catch (error) {
            throw new Error(error.message);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, changePassword }}>
            {children}
        </UserContext.Provider>
    );
};
