'use client'

import React from "react";
import { Button, Checkbox, Form, FormProps, Input } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./login.module.css";
import { constants } from "@/app/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/provider/AuthProvider";

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
    const { setUser } = useAppContext();
    /* REACT HOOKS END */

    const handleFormSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            const currentUser = await signInWithEmailAndPassword(auth, values.email, values.password);
            const formattedUser = formatAuthUser(currentUser.user, true);
            await axios.post(constants.AUTH, {
                type: 'login',
                user: formattedUser
            }).then(response => {
                console.log(response);
                router.push('/');
                setUser(formattedUser);
            }).catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.error("Error logging in:", error)
        }
    };

    const handleFormSubmitFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={styles.fullPageContainer}>
            <Form
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 15 }}
                className={styles.formContainer}
                style={{padding: 30}}
                initialValues={{ remember: true }}
                onFinish={handleFormSubmit}
                onFinishFailed={handleFormSubmitFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 6, span: 8 }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 6 }}>
                    <Button type="primary" htmlType="submit">
                        LOGIN
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginForm;