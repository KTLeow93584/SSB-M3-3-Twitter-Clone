// =========================================
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';

import { getSessionToken } from '../apis/authApi.jsx';

import ProfilePostCard from './ProfilePostCard.jsx';
import ModifyPostModal from './ModifyPostModal.jsx';
import DeletePostModal from './DeletePostModal.jsx';

import { months } from '../data/time.js';
import { fetchPostsByUser } from '../feature/posts/postsSlice.jsx';

import defaultProfileImage from '../assets/images/user-profile-default.webp';
// =========================================
export default function ProfileMidBody() {
    const [showModify, setShowModify] = useState(false);
    const onCloseModifyModalCallback = () => setShowModify(false);
    const onShowModifyModalCallback = () => setShowModify(true);

    const [showDelete, setShowDelete] = useState(false);
    const onCloseDeleteModalCallback = () => setShowDelete(false);
    const onShowDeleteModalCallback = () => setShowDelete(true);

    const [targetPost, setTargetPost] = useState(null);

    const onModifyPost = (post) => {
        setTargetPost(post);
        onShowModifyModalCallback();
    };

    const onDeletePost = (post) => {
        setTargetPost(post);
        onShowDeleteModalCallback();
    };

    const navigate = useNavigate();
    const onEditProfile = () => {
        navigate("/edit");
    };

    const dispatch = useDispatch();

    const activeUserObj = useSelector((state) => state.activeUser);
    const activeUser = activeUserObj.user;

    const posts = useSelector((state) => state.posts.posts);
    const loading = useSelector((state) => state.posts.loading);

    const sessionToken = getSessionToken();
    const decodedToken = jwtDecode(sessionToken);
    const userId = decodedToken.id;

    useEffect(() => {
        dispatch(fetchPostsByUser());
    }, [dispatch]);

    /*
    const onBrowseUsersCallback = () => {
        callServerAPI("users/1", "GET", null,
            // On Successful Callback
            (result) => {
                // Debug
                //console.log("[Users Query] Results.", result);

                const users = result.map((user) => ({
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    profileImage: user.profile_image,
                    followed: user.followed,
                    totalFollowers: user.total_followers
                }));
                navigate("/users", {
                    state: { users: users }
                });
            },
            // On Failed Callback
            (error) => {
                // Debug
                console.log("Error.", error);
            }
        );
    };
    */

    return (
        <>
            <Col className="col-md-5 col-lg-6 bg-light m-0 p-0" style={{ border: "1px solid lightgrey" }}>
                {
                    activeUser.banner_image ?
                        (<Image src={activeUser.banner_image} className="banner-img" />) :
                        (<div className="banner-img banner-default-bg" />)
                }

                <div className="d-flex align-items-center" style={{ marginTop: "-30px" }}>
                    <Image src={activeUser.profile_image ? activeUser.profile_image : defaultProfileImage}
                        roundedCircle
                        className="ms-3"
                        style={{
                            minWidth: "48px", minHeight: "48px", maxWidth: "128px", maxHeight: "128px",
                            width: "100%", height: "auto", border: "4px solid #ffffff", marginLeft: "15px"
                        }} />
                    <Button className="rounded-pill ms-auto me-3 fw-bold" variant="outline-secondary"
                        onClick={onEditProfile}>
                        Edit Profile
                    </Button>
                </div>

                <div className="mx-3">
                    <p className="mt-5 mx-0 mb-0" style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {activeUser.first_name + " " + activeUser.last_name}
                    </p>

                    <p style={{ marginBottom: "2px" }}>
                        @{activeUser.first_name + activeUser.last_name}
                    </p>

                    <div className="mt-3 mb-2">
                        <i className="bi bi-calendar3"></i>
                        <span> </span>
                        <span>Joined {months[activeUser.joined_at_month] + " " + activeUser.joined_at_year}</span>
                    </div>

                    <p style={{ fontSize: "0.9em" }}>
                        <strong>{activeUser.following_count}</strong> Following <strong>{activeUser.follower_count}</strong> Followers
                    </p>
                </div>

                <Nav variant="underline" defaultActiveKey="/home" justify>
                    <Nav.Item>
                        <Nav.Link eventKey="/home">Posts</Nav.Link>
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
                    loading && (
                        <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
                    )
                }
                {
                    posts.length > 0 ? posts.map((post) => (
                        <ProfilePostCard
                            key={post.id} post={post} userId={userId}
                            onModifyPostCallback={onModifyPost}
                            onDeletePostCallback={onDeletePost} />
                    )) : null
                }
            </Col>
            <ModifyPostModal show={showModify} post={targetPost} onCloseModalCallback={onCloseModifyModalCallback} />
            <DeletePostModal show={showDelete} post={targetPost} onCloseModalCallback={onCloseDeleteModalCallback} />
        </>
    )
}
// =========================================