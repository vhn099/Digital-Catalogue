'use client'

import React, { useEffect } from "react";
import { Button, Checkbox, Col, Flex, Form, FormProps, Input, Row, Typography } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./login.module.css";
import { constants } from "@/app/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthFirebaseContext } from "@/app/provider/AuthFirebaseProvider";
import Layout, { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

const formatAuthUser = (user: any, loggedIn: boolean) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    loggedIn: loggedIn
});

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};

const LoginForm = () => {
    /* REACT HOOKS START */
    const router = useRouter();
    const { user, setUser } = useAuthFirebaseContext();
    /* REACT HOOKS END */

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const handleFormSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            const currentUser = await signInWithEmailAndPassword(auth, values.email, values.password);
            const formattedUser = formatAuthUser(currentUser.user, true);
            setUser(formattedUser);
        } catch (error) {
            console.error("Error logging in:", error)
        }
    };

    const handleFormSubmitFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout style={{backgroundColor: "white"}}>
            <Row justify="space-between" gutter={[8, 8]}>
                <Col span={4}>
                </Col>
                <Col span={16}>
                    <div className={styles.fullPageContainer}>
                        <div className={styles.formContainer}>
                            
                            <Form
                                name="basic"
                                className={styles.loginForm}
                                style={{ padding: 30 }}
                                initialValues={{ remember: true }}
                                onFinish={handleFormSubmit}
                                onFinishFailed={handleFormSubmitFailed}
                            >
                                <Typography.Title>LOGIN</Typography.Title>
                                <Form.Item<FieldType>
                                    label="Email"
                                    name="email"
                                    labelCol={{span:5}}
                                    rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Password"
                                    name="password"
                                    labelCol={{span:5}}
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    name="remember"
                                    valuePropName="checked"
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        LOGIN
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                </Col>
            </Row>
        </Layout>

    )
}

export default LoginForm;