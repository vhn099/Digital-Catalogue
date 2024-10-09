import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card, Col, List, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import Link from 'next/link';

interface DataItem {
    id: string;
    ID: string;
    Image: string;
    Name: string;
    Order: string;
    Parent: string;
}

// Fetch data based on dynamic route
async function getSubCateFromFirestore(parent: string): Promise<DataItem[]> {
    try {
        // console.log('Sub Category parrent: ' + parent);
        const q = query(collection(db, 'sub_category'), where('Parent', '==', parent));
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
        // Fetch all subcategories from Firestore
        const querySnapshot = await getDocs(collection(db, 'sub_category'));
        const subCategories = querySnapshot.docs.map((doc) => doc.data()) as DataItem[];

        // Map the subcategories to generate params for dynamic routes
        return subCategories
            .filter(subCategory => subCategory.Parent)
            .map(subCategory => ({
                parent: subCategory.Parent,
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

export default async function SubCategoryPage({ params }: Props) {
    const { parent } = params;
    const data = await getSubCateFromFirestore(parent);
    // console.log('Sub Category: ');
    // console.log(data);
    if (data.length == 0) {
        return (
            <h1 style={{ padding: '24px' }}>No Items Found for this Category</h1>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={16}>
                {data.map((item) => (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                        <Link href={`/item/${item.id}`}>
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
}