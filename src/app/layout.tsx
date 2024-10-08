"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "@/components/Header/AppHeader";
import AppFooter from "@/components/Footer/AppFooter";
import AppProvider from "./provider/AuthProvider";
import { AuthFirebaseProvider } from "./provider/AuthFirebaseProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthFirebaseProvider>
          <AppHeader></AppHeader>

          <Content>
            <AntdRegistry>{children}</AntdRegistry>
          </Content>

          <AppFooter></AppFooter>
        </AuthFirebaseProvider>
      </body>
    </html>
  );
}