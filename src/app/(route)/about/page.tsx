import { Card, Image } from "antd";
import Meta from "antd/es/card/Meta";

export default function Page() {
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<Image alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>

    )
}