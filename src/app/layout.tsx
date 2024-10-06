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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUserSession = async () => {
      await axios.get(constants.AUTH, {
        params: {
          type: 'getSession'
        }
      }).then(response => {
        if (response.data.data) {
          router.push('/');
        } else {
          router.push('/login');
        }
        setUser(response.data.data);
      });
    };
    getUserSession();
  }, [router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          <AppHeader user={user} setUser={setUser}></AppHeader>

          <Content>
            <AntdRegistry>{children}</AntdRegistry>
          </Content>

          <AppFooter user={user}></AppFooter>
        </Layout>
      </body>
    </html>
  );
}