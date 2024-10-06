import { Footer } from 'antd/es/layout/layout';
import React from 'react';

interface AppFooterProps {
    user: any
}

const AppFooter = ({ user }: AppFooterProps) => {

    return user ? (
        <Footer>
            <div>Ant Design ©2016 Created by Ant UED</div>
        </Footer>
    ) : (
        <></>
    )
};

export default AppFooter;