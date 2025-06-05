import './Login.css';
import UsersTable from '../../components/UsersTable/UsersTable';
import { useFetchUsers } from '../Users/useFetchUsers';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Pour rediriger l'utilisateur

export function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook pour la navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Envoyer une requête POST au backend pour vérifier les informations d'identification
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                email,
                password,
            });

            // Si la connexion réussit, stocker l'utilisateur dans localStorage
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));

            // Rediriger vers la page "account"
            navigate('/account');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid email or password. Please try again.');
        }
    };

    return (
        <form className="LoginForm" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;