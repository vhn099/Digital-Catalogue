import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { destroyCookie } from 'nookies';
import { Header } from 'antd/es/layout/layout';

// interface AppHeaderProps {
//     email?: any,
//     logout?: () => {}
// };

interface AppHeaderProps {
    user: boolean
}

const AppHeader = ({ user }: AppHeaderProps) => {
    const router = useRouter();

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
            label: "LOGOUT",
            onClick: async () => {
                await signOut(auth);
                destroyCookie(null, 'digital_user_cookies', {
                    path: '/'
                });
                router.push("/login");
            }
        }
    ]

    return user ? (
        <Header>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={headerItems}
            >
            </Menu>
        </Header>

    ) : (<></>)
};

export default AppHeader;