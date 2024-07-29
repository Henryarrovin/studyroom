import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllFilesService } from '../services/fileSystemService';
import { setFileSystemData } from '../features/fileSystemSlice';

const useFileSystemData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const { request } = getAllFilesService();
        const response: any = await request;
        dispatch(setFileSystemData(response.data));
        setError(null);
      } catch (err: any) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [dispatch]);

  return { loading, error };
};

export default useFileSystemData;
