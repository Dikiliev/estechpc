import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { queryClient } from '@src/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from '@stores/StoreContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StoreProvider>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StoreProvider>
);
