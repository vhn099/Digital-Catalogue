import { Footer } from 'antd/es/layout/layout';
import * as React from 'react';

interface AppFooterProps {
    user: boolean
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