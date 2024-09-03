import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { rootStore } from '@src/stores';

const Logout = () => {
    const {
        authStore: { logout },
    } = rootStore;

    useEffect(() => {
        logout();
    }, []);
    return <Navigate to='/login' />;
};

export default Logout;
