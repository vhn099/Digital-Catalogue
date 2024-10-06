"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "@/components/Header/AppHeader";
import AppFooter from "@/components/Footer/AppFooter";
import { useEffect, useState } from "react";
import axios from "axios";
import { constants } from "./constants";
import { useRouter } from "next/navigation";
import AppProvider from "./provider/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  // useEffect(() => {
  //   const checkUserSession = async () => {
  //     await axios.get(constants.AUTH, {
  //       params: {
  //         type: 'getSession'
  //       }
  //     }).then(response => {
  //       console.log(response.data.data);
  //       if (!response.data.data) {
  //         router.push('/login');
  //       }
  //     });
  //   };
  //   checkUserSession();
  // }, [router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Layout>
            <AppHeader></AppHeader>

            <Content>
              <AntdRegistry>{children}</AntdRegistry>
            </Content>

            <AppFooter></AppFooter>
          </Layout>
        </AppProvider>
      </body>
    </html>
  );
}