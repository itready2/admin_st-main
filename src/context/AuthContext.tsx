/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface AuthContextType {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoggedin: boolean;
}

interface page {
    children: React.ReactNode;
}

const EndPoint: string = import.meta.env.VITE_ENDPOINT_URL

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<page> = ({ children }) => {

    const checkToken = () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const tokenExpiration = new Date(JSON.parse(atob(token.split('.')[1])).exp * 1000);
            const now = new Date();
            if (tokenExpiration > now) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const [isLoggedin, setIsLoggedin] = useState(checkToken());

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const tokenExpiration = new Date(JSON.parse(atob(token.split('.')[1])).exp * 1000);
            const now = new Date();
            if (tokenExpiration > now) {
                setIsLoggedin(true);
            } else {
                localStorage.removeItem('accessToken');
            }
        } else {
            setIsLoggedin(false);
        }
    }, []);


    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${EndPoint}/auth/login`, { email, password });
            const accessToken = response.data.accessToken;
            localStorage.setItem('accessToken', accessToken);
            setIsLoggedin(true);
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Propagate the error to the caller for handling
        }
    };

    const logout = () => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('accessToken');
                setIsLoggedin(false);
            }
        });

    };

    return (
        <AuthContext.Provider value={{ login, logout, isLoggedin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
