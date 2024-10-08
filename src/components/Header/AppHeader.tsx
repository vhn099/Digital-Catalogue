"use client"

import React, { Dispatch } from 'react';
import { Menu } from 'antd';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Header } from 'antd/es/layout/layout';
import axios from 'axios';
import { constants } from '@/app/constants';
import { useRouter } from 'next/navigation';
import { ScriptProps } from 'next/script';
import { useAppContext } from '@/app/provider/AuthProvider';


const AppHeader= () => {
    const router = useRouter();
    const { user, setUser } = useAppContext();

    const headerItems = [
        {
            key: 1,
            label: 'CATALOG',
            onClick: () => {
                router.push('/catalogue-category');
            }
        },
        {
            key: 2,
            label: 'ABOUT',
            onClick: () => {
                router.push('/about');
            }
        },
        {
            key: 3,
            label: 'CONTACT US',
            onClick: () => {
                router.push('/contact-us');
            }
        },
        {
            key: 4,
            label: 'ADMIN',
            onClick: () => {
                router.push('/admin');
            }
        },
        {
            key: 5,
            label: "LOGOUT",
            onClick: async () => {
                await signOut(auth);
                await axios.post(constants.AUTH, { type: 'logout' }).then(response => {
                    setUser(null);
                    router.push('/login');
                });
            }
        },
    ]

    return user ? (
        <Header>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={headerItems}
            >
            </Menu>
        </Header>
    ) : (<></>)
};

export default AppHeader;