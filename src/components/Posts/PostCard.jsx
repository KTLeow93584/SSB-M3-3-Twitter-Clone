// =========================================
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import { likeAPost, unlikeAPost } from '../../feature/posts/postsSlice.jsx';
import { getTimeFromNow } from '../../data/time.js';

import defaultProfileImage from '../../assets/images/user-profile-default.webp';
// =========================================
export default function ProfilePostCard({ post, userId, onModifyCallback = null, onDeleteCallback = null }) {
    // ===========================================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ===========================================
    const [likeLoaderVisibility, setLikeLoaderVisibility] = useState(false);

    const onClickLikeButton = () => {
        setLikeLoaderVisibility(true);

        if (post.liked === "False") {
            dispatch(likeAPost({ post_id: post.post_id })).then(
                (action) => {
                    setLikeLoaderVisibility(false);

                    // On Promise Rejected/Failed, Error Exception.
                    if (action.error) {
                        // Debug
                        //console.log("[On Like Failed] Payload.", action.payload);
                    }
                    // On Promise Fulfilled
                    else {
                        // Debug
                        //console.log("[On Like Successful] Payload.", action.payload);
                    }
                }
            );
        }
        else {
            dispatch(unlikeAPost({ post_id: post.post_id })).then(
                (action) => {
                    setLikeLoaderVisibility(false);
                    // On Promise Rejected/Failed, Error Exception.
                    if (action.error) {
                        // Debug
                        //console.log("[On Unlike Failed] Payload.", action.payload);
                    }
                    // On Promise Fulfilled
                    else {
                        // Debug
                        //console.log("[On Unlike Successful] Payload.", action.payload);
                    }
                }
            );
        }
    };
    const onClickCommentsButton = () => navigate(`/user/${userId}/post/${post.post_id}`);

    return (
        <Row className="mx-0 mt-3" style={{ borderBottom: "2px solid #d3d3d3" }}>
            <Col className="col-2">
                <Image src={post.profile_image ? post.profile_image : defaultProfileImage}
                    roundedCircle
                    className="ms-3"
                    style={{
                        minWidth: "32px", minHeight: "32px", maxWidth: "48px", maxHeight: "48px",
                        width: "100%", height: "auto"
                    }} />
            </Col>

            <Col>
                <div className="d-flex align-items-start justify-content-between">
                    <div className="d-flex align-items-center">
                        <strong className="me-1">{post.first_name + " " + post.last_name}</strong>
                        <p className="m-0 p-0" style={{ fontSize: "0.8em", color: "#777777" }}>
                            @{(post.first_name + post.last_name).replace(" ", "")} • {getTimeFromNow(new Date(post.created_at))}
                        </p>
                    </div>
                    {
                        post.user_id === userId ? (
                            <div className="ms-auto">
                                <Button variant="light" onClick={() => {
                                    if (onModifyCallback)
                                        onModifyCallback(post);
                                }}>
                                    <i className="bi bi-screwdriver"></i>
                                </Button>
                                <Button variant="light" onClick={() => {
                                    if (onDeleteCallback)
                                        onDeleteCallback(post);
                                }}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </div>
                        ) : null
                    }
                </div>
                <p>{post.post_content}</p>
                <div className="d-flex justify-content-between">
                    <Button variant="light" onClick={onClickCommentsButton}>
                        <i className="bi bi-chat">{" " + post.comment_count}</i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-repeat"></i>
                    </Button>
                    {
                        likeLoaderVisibility ? (
                            <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                <Spinner animation="border" variant="primary" style={{ width: "24px", height: "24px", borderWidth: "2px" }} />
                            </div>
                        ) : (
                            <Button variant="light" onClick={onClickLikeButton}>
                                <i className={`bi bi-heart${post.liked === "True" ? "-fill" : ""}`}>{" " + post.like_count}</i>
                            </Button>
                        )
                    }
                    <Button variant="light">
                        <i className="bi bi-graph-up"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-upload"></i>
                    </Button>
                </div>
            </Col>
        </Row>
    );
}
// =========================================