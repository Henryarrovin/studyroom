import { useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';
import { getUserByUsernameService } from '../services/userService';

interface UseUserDataResult {
    submitUserInput: (input: string) => Promise<void>;
}

const useUserData = (): UseUserDataResult => {
  const dispatch = useDispatch();

  const submitUserInput = async (input: string) => {
    try {
        localStorage.setItem('username', input);
        const response = await getUserByUsernameService(localStorage.getItem('username') as string);
        if (response.status === 200) {
            dispatch(setUser(response.data));
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
  };

  return { submitUserInput };
};

export default useUserData;