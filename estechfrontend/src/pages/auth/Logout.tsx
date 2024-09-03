import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { rootStore } from '@src/stores';

const Logout = () => {
    const { authStore } = rootStore;

    useEffect(() => {
        authStore.logout();
    }, []);
    return <Navigate to='/login' />;
};

export default Logout;
