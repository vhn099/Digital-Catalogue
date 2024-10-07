import React from 'react';
import Card from 'antd/es/card';
import Meta from "antd/es/card/Meta";
import { collection, getDocs } from 'firebase/firestore';
import { auth, cate } from "@/lib/firebase";
import { Col, Row } from 'antd';

interface DataItem {
    ID: string;
    Image: string;
    Name: string;
    Order: string;
}

// Async function to fetch data from Firebase Firestore
async function getCateFromFirestore(): Promise<DataItem[]> {
    if (!auth.currentUser) {
        console.error('User is not authenticated');
    }
    try {
        const querySnapshot = await getDocs(collection(cate, 'category'));
        const data: DataItem[] = querySnapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
        })) as DataItem[];

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export default async function CatalogueCategoryPage() {
    const data = await getCateFromFirestore();
    console.log(data);

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={16}>
                {data.map((item) => (
                    <Col key={item.ID} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            cover={<img alt={item.Name} src={item.Image} style={{ height: "300px" }} />}
                            style={{ marginBottom: '16px' }}
                        >
                            <Meta title={item.Name} description={item.Name} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};