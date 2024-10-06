"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import AppHeader from "@/components/Header/AppHeader";
import AppFooter from "@/components/Footer/AppFooter";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [userCookies, setUserCookie] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    const userCookies = cookies.digital_user_cookies ? true : false;
    setUserCookie(userCookies);

    console.log(userCookies, "user cookies");
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          <AppHeader user={userCookies}></AppHeader>

          <Content>
            <AntdRegistry>{children}</AntdRegistry>
          </Content>
          
          <AppFooter user={userCookies}></AppFooter>
        </Layout>
      </body>
    </html>
  );
}