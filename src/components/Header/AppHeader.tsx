"use client"

import React from 'react';
import { Image, Menu } from 'antd';
import { getAuth, signOut } from 'firebase/auth';
import styles from './AppHeader.module.css';
import { useAuthFirebaseContext } from '@/app/provider/AuthFirebaseProvider';
import { UserOutlined } from '@ant-design/icons';


const AppHeader = () => {
    const { user, setUser } = useAuthFirebaseContext();

    const headerItems = [
        {
            key: "PAGE-ICON",
            label: (
                <div style={{
                    width: "65px",
                    height: "65px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 20
                }}>
                    <a href='/home'><Image preview={false} src='/assets/adm_logo.webp' width={45} height={45} alt='' /></a>
                </div>
            ),
        },
        {
            key: "PROFILE",
            label: user ? (
                <UserOutlined style={{ fontSize: "30px", paddingRight: 15 }} />
            ) : <></>,
            className: `${styles.rightMenuItems} ${styles.profileItem}`,
            children: [
                {
                    key: "USER_PROFILE",
                    label: "PROFILE",
                    onClick: () => {
                        alert("PROFILE");
                    }
                },
                {
                    key: "LOGOUT",
                    label: <a href="/login">LOGOUT</a>,
                    onClick: async () => {
                        await signOut(getAuth());
                        setUser(null);
                    },
                },
            ]
        },
        {
            key: 5,
            label: user ? <span className={styles.headerItems}>SYSTEM CONFIG</span> : <></>,
            children: [
                {
                    key: "USER", label: (
                        <a href="/admin/user">Users</a>
                    )
                },
                { key: "ADMIN", label: "Admin" },
                { key: "EMAIL", label: "Email" }
            ],
            className: styles.rightMenuItems,
        },
        {
            key: 'CATALOUGE-MGMT',
            label: (
                user ? <span className={styles.headerItems}>CATALOUGE MGMT</span> : <></>
            ),
            children: [
                {
                    key: 1,
                    label: (
                        <a href="/catalogue-category">Category</a>
                    )
                },
                { key: "SUB-CATALOGUE", label: 'Sub Catalouge' },
                { key: "ITEM", label: 'Item' }
            ],
            className: styles.rightMenuItems,
        },
        {
            key: "CONTACT-US",
            label: (
                <a className={styles.headerItems} href="/contact-us">CONTACT US</a>
            ),
            className: styles.rightMenuItems,
        },
    ]
    return user ? (
        <Menu
            mode="horizontal"
            items={headerItems as any}
            color="black"
            style={{
                color: "black",
                fontSize: 14,
                fontFamily: 'sans-serif',
                display: 'block',
            }}
        >
        </Menu>
    ) : <></>;
};

export default AppHeader;