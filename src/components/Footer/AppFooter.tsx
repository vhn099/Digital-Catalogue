import { useAppContext } from '@/app/provider/AuthProvider';
import Link from 'next/link';
import { Footer } from 'antd/es/layout/layout';
import React from 'react';
import FooterStyle from './AppFooter.module.css';

const AppFooter = () => {
    const { user } = useAppContext();

    return user ? (
        <Footer>
            <div className={`footerStyle ${FooterStyle.footerStyle}`}>
                <Link href="https://www.admgroup.com/cookie-policy">Website Accessibility Statement</Link>
                <Link href="https://www.admgroup.com/cookie-policy">Cookie Policy</Link>
                <Link href="https://www.admgroup.com/website-terms-of-use">Website Terms of Use</Link>
                <Link href="https://www.admgroup.com/website-privacy-policy">Website Privacy Policy</Link>
                <Link href="https://www.admgroup.com/data-security-policy">Data Security Policy</Link>
            </div>
        </Footer>
    ) : (
        <></>
    )
};

export default AppFooter;