import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card, Col, List, Row } from 'antd';
import Meta from 'antd/es/card/Meta';

interface DataItem {
    id: string;
    ID: string;
    Image: string;
    Name: string;
    Order: string;
    Parent: string;
}

// Fetch data based on dynamic route
async function getItemFromFirestore(parent: string): Promise<DataItem[]> {
    try {
        // console.log('Item parrent: ' + parent);
        const q = query(collection(db, 'item'), where('Parent', '==', parent));
        const querySnapshot = await getDocs(q);
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

// Function to generate static params from Firestore
export async function generateStaticParams() {
    try {
        // Fetch all items from Firestore
        const querySnapshot = await getDocs(collection(db, 'item'));
        const items = querySnapshot.docs.map((doc) => doc.data()) as DataItem[];

        // Safeguard: Only return paths for items that have the 'Parent' field
        return items
            .filter(item => item.Parent) // Filter items that have a 'Parent' field
            .map(item => ({
                parent: item.Parent, // Assuming 'Parent' is the dynamic parameter
            }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];  // Return an empty array in case of failure
    }
}

// Server Component
interface Props {
    params: {
        parent: string;
    };
}

export default async function ItemPage({ params }: Props) {
    const { parent } = params;
    const data = await getItemFromFirestore(parent);
    // console.log('Item: ');
    // console.log(data);
    if (data.length == 0) {
        return (
            <h1 style={{ padding: '24px' }}>No Items Found for this Subcategory</h1>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={16}>
                {data.map((item) => (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            // eslint-disable-next-line @next/next/no-img-element
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
}