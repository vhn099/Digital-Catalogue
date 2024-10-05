'use client'

import React from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import styles from './login.module.css';
import { useRouter } from "next/navigation";
import { loginFirebase } from "./login";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

const LoginForm = () => {
    const [form] = Form.useForm();
    
    const fields = [
        { name: ['email'], value: ''},
        { name: ['password'], value: '' }
    ];
    
    const { token } = useToken();
    const router = useRouter();
    const screens = useBreakpoint();

    const styles = {
        container: {
            margin: "0 auto",
            padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
            width: "380px"
        },
        forgotPassword: {
            float: "right"
        },
        header: {
            marginBottom: token.marginXL
        },
        section: {
            alignItems: "center",
            backgroundColor: token.colorBgContainer,
            display: "flex",
            height: screens.sm ? "100vh" : "auto",
            padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
        },
        text: {
            color: token.colorTextSecondary
        },
        title: {
            fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
        }
    };

    const onFinish = async (values: { email: string, password: string }) => {
        const results = await loginFirebase(values.email, values.password);

        if (results.userModel.login) {
            router.push('/home');
            router.refresh();
        }
    };

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
                        <path
                            d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
                            fill="white"
                        />
                        <path
                            d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
                            fill="white"
                        />
                        <path
                            d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
                            fill="white"
                        />
                    </svg>

                    <Title style={styles.title}>Login</Title>
                </div>
                <Form
                    form={form}
                    fields={fields}
                    name="normal_login"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: "email",
                                required: true,
                                message: "Please input your Email!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Password!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a style={{
                            float: "right"
                        }}>
                            Forgot password?
                        </a>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: "0px" }} shouldUpdate>
                        {() => {
                            const isFieldTouched = form.isFieldsTouched(true); // If user has not put any data in any input then it will false
                            const formHasErrors = form.getFieldsError().filter(({ errors }) => errors.length).length === 0;
                            return (
                                <Button
                                    block={true}
                                    type="primary"
                                    htmlType="submit"
                                    disabled={
                                        isFieldTouched || !formHasErrors
                                    }
                                >
                                    Log in
                                </Button>
                            )
                        }}
                        
                    </Form.Item>
                </Form>
            </div>
        </section>
    )
}

export default LoginForm;