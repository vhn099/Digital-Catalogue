"use client"

import { useAuthFirebaseContext } from "@/app/provider/AuthFirebaseProvider";
import { Button, Col, Drawer, Form, FormProps, Input, Layout, Row, Space, Table, TableProps, message, notification } from "antd";
import { useState } from "react";
import bcrypt from 'bcryptjs';
import LoadingOverlay from "@/components/Loading/LoadingOverLay";
import { constants } from "@/app/constants";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, updatePassword } from "firebase/auth";

interface DataType {
    key: string,
    email: string,
    full_name: string,
    created: string,
}

type FieldType = {
    key: string,
    email: string;
    full_name?: string;
    password: string;
};

type ComponentProps = {
    users: any
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function UserPageClient({ users }: ComponentProps) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [formValues, setFormValues] = useState({} as DataType); // Set form values when user clicks edit
    const [api, contextHolder] = notification.useNotification(); // Define notifications
    const { user, auth, loading, setLoading } = useAuthFirebaseContext();

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
        },
        {
            title: "",
            key: 'button_key',
            dataIndex: 'button_key',
            render: (text, record) => (
                <button onClick={() => {
                    showDrawer();
                    setFormValues({
                        key: record.key,
                        email: record.email,
                        full_name: record.full_name,
                        created: record.key
                    });
                }}>
                    <EditOutlined style={{ fontSize: "28px" }} />
                </button>
            ),
        },
        {
            title: "",
            key: 'delete_button',
            dataIndex: 'delete_button',
            render: (text, record) => (
                <button onClick={() => {
                    console.log(record);
                }}>
                    <DeleteOutlined style={{ fontSize: "28px" }} />
                </button>
            ),
        }
    ];

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onClose = () => {
        setDrawerVisible(false);
        setFormValues({
            key: "",
            email: "",
            full_name: "",
            created: "",
        });
    };

    // Open notifications flexible based on type, message, description get from Server API
    const openNotificationWithIcon = (type: NotificationType, message: string, description: string) => {
        api.open({
            type: type,
            message: message,
            description: description
        });
    };

    const handleFormSubmit: FormProps<FieldType>['onFinish'] = async (values: any) => {
        setLoading(true);

        // Call API to create / update a user in collection user
        await axios.post(constants.API.USER, {
            id: values.key,
            userData: {
                email: values.email,
                fullName: values.fullName,
                created: Timestamp.fromDate(new Date()),
                created_by: user.email,
                updated: Timestamp.fromDate(new Date()),
                updated_by: user.email
            },
            auth: auth
        }).then(async response => {
            console.log(response);

            // CREATE USER IN FIREBASE
            try {
                if (response.data.code === 200) {
                    await createUserWithEmailAndPassword(getAuth(), values.email, values.password).then((firebaseRes: any) => {
                        if (response.data.code === 200) {
                            setDrawerVisible(false);
                        }
                    });
                }

            } catch (error: any) {
                response.data.status = "error";
                response.data.message = "FIREBASE ERROR";
                response.data.description = error.message;
            }

            openNotificationWithIcon(response.data.status, response.data.message, response.data.description);
        }).catch(error => {
            console.log(error);
        });
        // Add user logic here
        setLoading(false);
    };

    return (
        <Layout style={{
            height: "inherit",
            paddingTop: 20
        }}>
            <Row>
                <Col span={4}>

                </Col>
                <Col span={16}>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="primary" shape="default" onClick={showDrawer}>
                            ADD USER
                        </Button>
                    </div>
                    <div>
                        <Layout>
                            <Table<DataType>
                                columns={columns}
                                dataSource={users}
                                style={{
                                    borderRadius: "16px"
                                }}
                            />
                        </Layout>

                        <Drawer
                            title="Insert User"
                            placement="right"
                            closable={false}
                            onClose={onClose}
                            open={drawerVisible}
                            width={500}
                        >

                            <Form
                                name="insert-user"
                                layout="vertical"
                                initialValues={formValues}
                                onFinish={handleFormSubmit}
                            >
                                {formValues.key ? (
                                    <Form.Item<FieldType>
                                        name="key"
                                        label="User ID"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                ) : <></>}

                                <Form.Item<FieldType>
                                    name="email"
                                    label="Email"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'email',
                                            message: 'Please input user email!',
                                        },
                                    ]}
                                >
                                    <Input readOnly={formValues.key ? true : false} />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    name="full_name"
                                    label="Full Name"
                                    rules={[
                                        {
                                            message: 'Please input user full name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                {!formValues.key ? (
                                    <Form.Item<FieldType>
                                        name="password"
                                        label="Password"
                                        rules={[
                                            {
                                                min: 6,
                                                required: true,
                                                message: 'Please input user password!',
                                            },
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>) : <></>
                                }
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ marginRight: 5 }}>
                                        Submit
                                    </Button>

                                    <Button type="default" htmlType="button" onClick={onClose} style={{ marginLeft: 5 }}>
                                        Close
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Drawer>
                    </div>

                </Col>
                <Col span={4}></Col>
            </Row>
            {loading ? <LoadingOverlay /> : <></>}
            {contextHolder}
        </Layout>
    );
};