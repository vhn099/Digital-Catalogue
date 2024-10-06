import { useAppContext } from '@/app/provider/AuthProvider';
import { Footer } from 'antd/es/layout/layout';
import React from 'react';

const AppFooter = () => {
    const { user } = useAppContext();

    return user ? (
        <Footer>
            <div>Ant Design ©2016 Created by Ant UED</div>
        </Footer>
    ) : (
        <></>
    )
};

export default AppFooter;