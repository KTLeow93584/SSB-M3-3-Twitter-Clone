// =========================================
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
// =========================================
export default function ProfilePostCard({content}) {
    const pic = "https://pbs.twimg.com/profile_images/1668651557456424971/o2gw4jmn_400x400.png";

    return (
        <Row className="p-3" style={{ borderTop: "1px solid #d3d3d3", borderBottom: "1px solid #d3d3d3" }}>
            <Col className="col-sm-1">
                <Image src={pic} fluid roundedCircle />
            </Col>

            <Col>
                <strong>Kaz</strong>
                <p className="mt-0 mb-2 py-0" style={{ color: "#777777" }}>@kaz</p>
                <p>{content}</p>
                <div className="d-flex justify-content-between">
                    <Button variant="light">
                        <i className="bi bi-chat"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-repeat"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-heart"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-graph-up"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-upload"></i>
                    </Button>
                </div>
            </Col>
        </Row>
    )
}
// =========================================