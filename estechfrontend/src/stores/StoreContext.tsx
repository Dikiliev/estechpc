import React, { createContext, useContext } from 'react';
import rootStore from '@stores/rootStore'; // Обратите внимание, что импорт происходит из rootStore

const StoreContext = createContext(rootStore);

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};
