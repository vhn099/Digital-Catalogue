import React from 'react';
import styles from './AppHeader.module.css';
import { Menu } from 'antd';
import Item from 'antd/es/list/Item';
import Link from 'next/link';

const AppHeader = async () => {
    const headerItems = [
        {
            key: 1,
            // icon: <UserOutLined />
            label: 'CATALOG',
            // className: ""
        },
        {
            key: 2,
            label: (
                <Link href="/login">LOGIN</Link>
            ),
            className: ""
        },
        {
            key: 3,
        }
    ]

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={headerItems}
        >
        </Menu>
    )
};

export default AppHeader;