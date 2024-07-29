import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginService, registerService } from '../services/userService';
import { Login, Register, User } from '../services/userService';
import { logOut, selectCurrentToken, setToken } from '../features/authSlice';
import { removeUser } from '../features/userSlice';

interface UseAuthResult {
    token: string | null;
    user: User | null;
    error: string | null;
    loading: boolean;
    login: (payload: Login) => Promise<void>;
    register: (payload: Register) => Promise<void>;
    logout: () => void;
}

const useAuth = (): UseAuthResult => {
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const login = useCallback(async (payload: Login): Promise<void> => {
        setLoading(true);
        try {
            const response = await loginService.create(payload);
            if (response.status === 200) {
                const { accessToken } = response.data;
                dispatch(setToken({ accessToken }));
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
    }, [dispatch]);    


    const register = useCallback(async (payload: Register): Promise<void> => {
        setLoading(true);
        try {
            const response = await registerService.create(payload);
            setUser(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        dispatch(logOut());
        dispatch(removeUser());
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
    }, [dispatch]);

    return { token, user, error, loading, login, register, logout };
};

export default useAuth;