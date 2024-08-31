import React from 'react';

import box from '@assets/images/free-icon-box-685391.png';
import BaseEmptyState from '@components/BaseEmptyState/BaseEmptyState';

const CartEmptyStateComponent: React.FC = () => {
    return <BaseEmptyState title={'Ваша корзина пуста'} icon={box} buttons={[{ name: 'Перейти к покупкам', url: '/catalog' }]} />;
};

export default CartEmptyStateComponent;
