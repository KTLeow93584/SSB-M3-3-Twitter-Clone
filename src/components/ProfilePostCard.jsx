// =========================================
import { useDispatch } from 'react-redux';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import { likeAPost, unlikeAPost } from '../feature/posts/postsSlice.jsx';

import defaultProfileImage from '../assets/images/user-profile-default.webp';
// =========================================
export default function ProfilePostCard({ post, userId, onModifyPostCallback = null, onDeletePostCallback = null }) {
    const dispatch = useDispatch();
    const onClickLikeButton = () => dispatch(post.liked === "False" ? likeAPost({ post_id: post.id }) : unlikeAPost({ post_id: post.id }));

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
                        <p className="m-0 p-0" style={{ fontSize: "0.8em", color: "#777777" }}>@{(post.first_name + post.last_name).replace(" ", "")} • {"Insert Date Here"}</p>
                    </div>
                    {
                        post.user_id === userId ? (
                            <div className="ms-auto">
                                <Button variant="light" onClick={() => {
                                    if (onModifyPostCallback)
                                        onModifyPostCallback(post);
                                }}>
                                    <i className="bi bi-screwdriver"></i>
                                </Button>
                                <Button variant="light" onClick={() => {
                                    if (onDeletePostCallback)
                                        onDeletePostCallback(post);
                                }}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </div>
                        ) : null
                    }
                </div>
                <p>{post.content}</p>
                <div className="d-flex justify-content-between">
                    <Button variant="light">
                        <i className="bi bi-chat"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-repeat"></i>
                    </Button>
                    <Button variant="light" onClick={onClickLikeButton}>
                        <i className={`bi bi-heart${post.liked === "True" ? "-fill" : ""}`}>{" " + post.like_count}</i>
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