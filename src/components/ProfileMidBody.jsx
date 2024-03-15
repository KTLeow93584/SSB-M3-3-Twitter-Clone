// =========================================
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';

import ProfilePostCard from './ProfilePostCard.jsx';
import { getSessionToken, callServerAPI } from '../apis/authApi.jsx';
// =========================================
export default function ProfileMidBody() {
    const [posts, setPosts] = useState([]);

    const url = "https://pbs.twimg.com/profile_banners/1500965847896305664/1710384523/1500x500";
    const pic = "https://pbs.twimg.com/profile_images/1668651557456424971/o2gw4jmn_400x400.png";

    // Fetch posts based on user id.
    const onFetchUserPosts = (userId) => {
        callServerAPI(`posts/user/${userId}`, "GET", null,
            // On Successful Callback
            (data) => {
                // Debug
                // console.log("[User Posts GET] Returned Data.", data);

                setPosts(data.posts);
            },
            // On Failed Callback
            (error) => console.log("Error.", error)
        );
    };

    useEffect(() => {
        const token = getSessionToken();
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            onFetchUserPosts(userId);
        }

        const onNewPostCreatedCallback = (newPostData) => {
            setPosts((previousPosts) => {
                const newPosts = [...previousPosts];
                newPosts.push(newPostData.detail);

                return newPosts;
            });
        };

        window.addEventListener("On Create New Post", onNewPostCreatedCallback);
        return (() => {
            window.removeEventListener("On Create New Post", onNewPostCreatedCallback);
        });
    }, []);

    return (
        <Col className="col-6 bg-light" style={{ border: "1px solid lightgrey" }}>
            <Image src={url} fluid />
            <br />
            <Image src={pic} roundedCircle style={{ width: 150, position: "absolute", top: "140px", border: "4px solid #f8f9fa", marginLeft: 15 }} />

            <Row className="justify-content-end">
                <Col xs="auto">
                    <Button className="rounded-pill mt-2" variant="outline-secondary">
                        Edit Profile
                    </Button>
                </Col>
            </Row>

            <p className="mt-5" style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}>
                Kaz
            </p>

            <p style={{ marginBottom: "2px" }}>
                @kaz
            </p>

            <p>I help robots with robots at robots.co.</p>

            <p>Robotpreneur</p>

            <p>
                <strong>1313</strong> Following <strong>444</strong> Followers
            </p>

            <Nav variant="underline" defaultActiveKey="/home" justify>
                <Nav.Item>
                    <Nav.Link eventKey="/home">Tweets</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Replies</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Highlights</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-3">Media</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-4">Likes</Nav.Link>
                </Nav.Item>
            </Nav>
            {
                posts.length > 0 ? posts.map((post) => (<ProfilePostCard key={post.id} content={post.content} />)) : null
            }
        </Col>
    )
}
// =========================================