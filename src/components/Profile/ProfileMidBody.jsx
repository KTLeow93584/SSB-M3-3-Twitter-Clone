// =========================================
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';

import ProfilePostCard from '../Posts/PostCard.jsx';
import ModifyPostModal from '../Posts/ModifyPostModal.jsx';
import DeletePostModal from '../Posts/DeletePostModal.jsx';

import { months } from '../../data/time.js';
import { onLoadingStart, onLoadingEnd } from '../../data/loaders.js';

import { fetchPostsByUserId, fetchPostsSelf } from '../../feature/posts/postsSlice.jsx';
import { updateActiveUser } from '../../feature/activeUser/activeUserSlice.jsx';
import { getUserInfo, getPersonalInfo } from '../../feature/viewedUser/viewedUserSlice.jsx';

import defaultProfileImage from '../../assets/images/user-profile-default.webp';
// =========================================
export default function ProfileMidBody() {
    // ========================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ========================
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
    // ========================
    const onEditProfile = () => navigate("/profile/edit");

    const posts = useSelector((state) => state.posts.posts);
    const user = useSelector((state) => state.viewedUser.user);
    const userIdParamRef = useParams().user_id;
    // ========================
    const [postLoaderVisibility, setPostLoaderVisibility] = useState(false);

    useEffect(() => {
        onLoadingStart("Global");

        if (userIdParamRef) {
            dispatch(getUserInfo({ user_id: userIdParamRef })).then(
                (action) => {
                    // On Promise Rejected/Failed, Error Exception.
                    if (action.error) {
                        // Debug
                        //console.log("[User Info Failed] Payload.", action.payload);
                    }
                    // On Promise Fulfilled
                    else {
                        setPostLoaderVisibility(true);

                        // Debug
                        //console.log("[User Info Succeeded] Payload.", action.payload);

                        // Get Latest Posts of the active page of a specific user (incl. self).
                        dispatch(fetchPostsByUserId({ user_id: userIdParamRef })).then(
                            (action) => {
                                onLoadingEnd("Global");
                                setPostLoaderVisibility(false);

                                // On Promise Rejected/Failed, Error Exception.
                                if (action.error) {
                                    // Debug
                                    //console.log("[Fetch User's Posts Failed] Payload.", action.payload);
                                }
                                // On Promise Fulfilled
                                else {
                                    // Debug
                                    //console.log("[Fetch User's Posts Succeeded] Payload.", action.payload);
                                }
                            }
                        );
                    }
                }
            );
        }
        else {
            dispatch(getPersonalInfo()).then(
                (action) => {
                    // On Promise Rejected/Failed, Error Exception.
                    if (action.error) {
                        // Debug
                        //console.log("[User Info Failed] Payload.", action.payload);
                    }
                    // On Promise Fulfilled
                    else {
                        setPostLoaderVisibility(true);
                        // Debug
                        //console.log("[User Info Succeeded] Payload.", action.payload);

                        dispatch(updateActiveUser(action.payload));

                        // Get Latest Posts of the active page of a specific user (incl. self).
                        dispatch(fetchPostsSelf()).then(
                            (action) => {
                                onLoadingEnd("Global");
                                setPostLoaderVisibility(false);

                                // On Promise Rejected/Failed, Error Exception.
                                if (action.error) {
                                    // Debug
                                    //console.log("[Fetch User's Posts Failed] Payload.", action.payload);
                                }
                                // On Promise Fulfilled
                                else {
                                    // Debug
                                    //console.log("[Fetch User's Posts Succeeded] Payload.", action.payload);
                                }
                            }
                        );
                    }
                }
            );
        }
    }, [dispatch, userIdParamRef]);
    // ========================
    return (
        <>
            <Col className="col-md-5 col-9 bg-light m-0 p-0 bg-secondary" style={{ border: "1px solid lightgrey", minHeight: "100vh" }}>
                {
                    user && user.banner_image ?
                        (<Image src={user.banner_image} className="banner-img" />) :
                        (<div className="banner-img banner-default-bg" />)
                }

                <div className="d-flex align-items-center" style={{ marginTop: "-30px" }}>
                    <Image src={user && user.profile_image ? user.profile_image : defaultProfileImage}
                        roundedCircle
                        className="ms-3"
                        style={{
                            minWidth: "48px", minHeight: "48px", maxWidth: "128px", maxHeight: "128px",
                            width: "100%", height: "auto", border: "4px solid #ffffff", marginLeft: "15px"
                        }} />
                    {
                        user && user.is_authorized ? (
                            <Button className="rounded-pill ms-auto me-3 fw-bold" variant="outline-secondary"
                                onClick={onEditProfile}>
                                Edit Profile
                            </Button>
                        ) : null
                    }
                </div>

                <div className="mx-3">
                    <p className="mt-5 mx-0 mb-0" style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {user ? (user.first_name + " " + user.last_name) : ""}
                    </p>

                    <p style={{ marginBottom: "2px" }}>
                        @{user ? ((user.first_name + user.last_name).replace(" ", "")) : ""}
                    </p>

                    <div className="mt-3 mb-2">
                        <i className="bi bi-calendar3"></i>
                        <span> </span>
                        <span>Joined {user ? (months[user.joined_at_month] + " " + user.joined_at_year) : ""}</span>
                    </div>

                    <p style={{ fontSize: "0.9em" }}>
                        <strong>{user ? user.following_count : 0}</strong> Following <strong>{user ? user.follower_count : 0}</strong> Followers
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
                    user && postLoaderVisibility && (
                        <div className="d-flex justify-content-center mt-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )
                }
                {
                    postLoaderVisibility ? null : (
                        user && posts.length > 0 ? posts.map((post) => (
                            <ProfilePostCard
                                key={`post-#${post.post_id}`}
                                post={post}
                                userId={user.user_id}
                                onModifyCallback={onModifyPost}
                                onDeleteCallback={onDeletePost} />
                        )) : (
                            <div className="d-flex justify-content-center mt-5">
                                <p className="mx-4 p-0 text-center fw-bold" style={{ fontSize: "0.9em" }}>
                                    Kickstart your journey via clicking on the &quot;Tweet&quot; button and share with us how was your day!
                                </p>
                            </div>
                        )
                    )
                }
            </Col>
            <ModifyPostModal show={showModify} post={targetPost} onCloseModalCallback={onCloseModifyModalCallback} />
            <DeletePostModal show={showDelete} post={targetPost} onCloseModalCallback={onCloseDeleteModalCallback} />
        </>
    )
}
// =========================================