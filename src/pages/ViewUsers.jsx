// =========================================
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import NavigationPanel from '../components/NavigationPanel.jsx';

import { callServerAPI } from '../apis/authApi.jsx';
import defaultProfileImage from "../assets/images/user-profile-default.webp";
// =========================================
export default function ViewUsers() {
    const userObj = useSelector((state) => state.activeUser);
    const user = userObj.user;

    const location = useLocation();

    const [users, setUsers] = useState(location.state.users);

    // Debug
    //console.log("Users", users);

    const onFollowUser = (user_id, index) => {
        callServerAPI("follow", "DELETE", { user_id: user_id },
            // On Successful Callback
            (data) => {
                // Debug
                console.log("Successfully followed user.", user);

                const newUsers = [...users];
                newUsers[index].followed = data.followed;
                newUsers[index].totalFollowers = data.total_followers;
                setUsers(newUsers);
            },
            // On Failed Callback
            (error) => {
                // Debug
                console.log("Failed to follow user.", error);
            }
        );
    };

    const onUnfollowUser = (user_id, index) => {
        callServerAPI("unfollow", "POST", { user_id: user_id },
            // On Successful Callback
            (data) => {
                // Debug
                console.log("Successfully un-followed user.", user);

                const newUsers = [...users];
                newUsers[index].followed = data.followed;
                newUsers[index].totalFollowers = data.total_followers;
                setUsers(newUsers);
            },
            // On Failed Callback
            (error) => {
                // Debug
                console.log("Failed to un-follow user.", error);
            }
        );
    };

    return (
        <>
            <NavigationPanel user={user} />
            <Container fluid className="mt-3">
                <Row className="w-100 py-4 mx-0 px-0">
                    {
                        users.map((user, index) => (
                            <Col key={`user-${index}}`}
                                className="col-sm-12 col-md-6 col-lg-4 mt-1 mb-4 d-flex align-items-center justify-content-start rounded">
                                <Image src={user.profileImage ? new URL(user.profileImage, import.meta.url) : defaultProfileImage}
                                    className="me-3"
                                    style={{ minWidth: "32px", minHeight: "32px", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto" }} />
                                <div className="border-3 mb-2">
                                    <p className="fs-6 fw-bold mb-2">
                                        <span className="fw-normal">Name: </span>{user.firstName} {user.lastName}
                                    </p>
                                    <p className="fs-6 fw-bold mb-2">
                                        <span className="fw-normal">Followers: </span>{user.totalFollowers}
                                    </p>
                                    <Button variant={user.followed ? "secondary" : "primary"}
                                        onClick={user.followed ? () => onUnfollowUser(user.id, index) : () => onFollowUser(user.id, index)}>
                                        {user.followed ? "Followed" : "Follow"}
                                    </Button>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            </Container>
        </>
    );
}
// =========================================