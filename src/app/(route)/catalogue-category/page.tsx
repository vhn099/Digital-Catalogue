import React from 'react';
import Card from 'antd/es/card';
import Meta from "antd/es/card/Meta";
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase";
import { Col, List, Row } from 'antd';
import Link from 'next/link';

interface DataItem {
    id: string;
    ID: string;
    Image: string;
    Name: string;
    Order: string;
}

// Async function to fetch data from Firebase Firestore
async function getCateFromFirestore(): Promise<DataItem[]> {
    try {
        const querySnapshot = await getDocs(collection(db, 'category'));
        const data: DataItem[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
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
    // console.log('Catefory:');
    // console.log(data);
    if (data.length == 0) {
        return (
            <h1 style={{ padding: '24px' }}>No Item</h1>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={16}>
                {data.map((item) => (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                        <Link href={`/sub-category/${item.id}`}>
                            <Card
                                hoverable
                                // eslint-disable-next-line @next/next/no-img-element
                                cover={<img alt={item.Name} src={item.Image} style={{ height: "300px" }} />}
                                style={{ marginBottom: '16px' }}
                            >
                                <Meta title={item.Name} description={item.Name} />
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};