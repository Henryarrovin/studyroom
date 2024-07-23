import { useState, useCallback } from 'react';
import { loginService, registerService } from '../services/userService';
import { Login, Register, User } from '../services/userService';

interface UseAuthResult {
    token: string | null;
    user: User | null;
    error: string | null;
    loading: boolean;
    login: (payload: Login) => Promise<void>;
    register: (payload: Register) => Promise<void>;
}

const useAuth = (): UseAuthResult => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const login = useCallback(async (payload: Login): Promise<void> => {
        setLoading(true);
        try {
            const response = await loginService.create(payload);
            if (response.status === 200) {
                const { accessToken } = response.data;
                setToken(accessToken);
                localStorage.setItem('authToken', accessToken);
                setError(null);
            } else {
                throw new Error(`Login failed ...`);
            }
        } catch (err: any) {
            setError('Login failed ...');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);    


    // Register is not yet completed !!!
    const register = useCallback(async (payload: Register): Promise<void> => {
        setLoading(true);
        try {
            const response = await registerService.create(payload);
            setUser(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }, []);

    return { token, user, error, loading, login, register };
};

export default useAuth;