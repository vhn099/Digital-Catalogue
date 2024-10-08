"use client"

import React from 'react';
import { Menu } from 'antd';
import { getAuth, signOut } from 'firebase/auth';
import { Header } from 'antd/es/layout/layout';
import { useAuthFirebaseContext } from '@/app/provider/AuthFirebaseProvider';


const AppHeader = () => {
    const { user, setUser } = useAuthFirebaseContext();

    const styles = {
        menuItem: {
            lineHeight: "5",
        }
    };

    const headerItems = [
        {
            key: "PAGE-ICON",
            label: (
                <div style={{
                    width: "70px",
                    height: "70px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <a href='/home'><img src='/assets/adm_logo.webp' width="70px" height="70px" /></a>
                </div>
            ),
        },
        {
            key: "CONTACT-US",
            label: (
                <a style={styles.menuItem} href="/contact-us">CONTACT US</a>
            ),
        },
        {
            key: 'CATALOUGE-MGMT',
            label: (
                user ? <span style={styles.menuItem}>CATALOUGE MGMT</span> : <></>
            ),
            children: [
                { 
                    key: 1,
                    label: (
                        <a style={styles.menuItem} href="/catalogue-category">Category</a>
                    )
                },
                { key: "SUB-CATALOGUE", label: 'Sub Catalouge' },
                { key: "ITEM", label: 'Item' }
            ],
        },
        {
            key: 5,
            label: user ? <span style={styles.menuItem}>SYSTEM CONFIG</span> : <></>,
            children: [
                { key: "USER", label: (
                    <a href="/admin/user">User</a>
                ) },
                { key: "ADMIN", label: "Admin" },
                { key: "EMAIL", label: "Email" }
            ],
        },
        {
            key: "LOGOUT",
            label: user ? (
                <a style={styles.menuItem} href="/login">LOGOUT</a>
            ) : <></>,
            onClick: async () => {
                await signOut(getAuth());
                setUser(null);
            },
            className: styles.menuItem
        },
    ]
    return (
        <Header style={{ backgroundColor: 'white' }}>
            <Menu
                mode="horizontal"
                items={headerItems}
                color="black"
                style={{
                    color: "black",
                    fontSize: 14,
                    fontFamily: 'sans-serif',
                    justifyContent: 'center',
                }}
            >
            </Menu>
        </Header>
    );
};

export default AppHeader;