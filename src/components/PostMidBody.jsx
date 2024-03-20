// =========================================
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import ModifyPostModal from './ModifyPostModal.jsx';
import DeletePostModal from './DeletePostModal.jsx';

import ModifyCommentModal from './ModifyCommentModal.jsx';
import DeleteCommentModal from './DeleteCommentModal.jsx';

import CommentCard from '../components/CommentCard.jsx';

import { formatDate, formatTime } from '../data/time.js';
import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';

import { fetchPostsByUser, fetchPostData, likeAPost, unlikeAPost } from '../feature/posts/postsSlice.jsx';
import { createNewComment, loadCommentsFromPostData } from '../feature/comments/commentsSlice.jsx';

import defaultProfileImage from '../assets/images/user-profile-default.webp';
// =========================================
export default function PostMidBody() {
    // ===========================================
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // ===========================================
    const [likeLoaderVisibility, setLikeLoaderVisibility] = useState(false);
    // ===========================================
    const [post, setPost] = useState(null);
    const postID = useParams().id;
    const [postLoaderVisibility, setPostLoaderVisibility] = useState(false);

    const posts = useSelector((state) => state.posts.posts);

    useEffect(() => {
        const onFetchPostData = () => {
            dispatch(fetchPostData({ post_id: postID })).then(
                (action) => {
                    setPostLoaderVisibility(false);

                    // On Promise Rejected/Failed, Error Exception.
                    if (action.error) {
                        // Debug
                        //console.log("[Fetch User's Specific Post] Payload.", action.payload);
                    }
                    // On Promise Fulfilled
                    else {
                        // Debug
                        //console.log("[Fetch User's Specific Post] Payload.", action.payload);

                        setPost(action.payload.client_data.post);
                        setPostDate(new Date(action.payload.client_data.post.created_at));
                        dispatch(loadCommentsFromPostData({ comments: action.payload.client_data.comments }));
                    }
                }
            );
        };

        setPostLoaderVisibility(true);

        if (posts.length <= 0) {
            dispatch(fetchPostsByUser()).then(
                (action) => {
                    // On Promise Rejected/Failed, Error Exception.
                    if (action.error) {
                        // Debug
                        //console.log("[Fetch User Posts Failed] Payload.", action.payload);
                    }
                    // On Promise Fulfilled
                    else {
                        // Debug
                        //console.log("[Fetch User Posts Succeeded] Payload.", action.payload);
                        onFetchPostData();
                    }
                }
            );
        }
        else
            onFetchPostData();
    }, [dispatch, postID]);
    // ===========================================
    // List of existing comments queried that's tied to the post.
    const comments = useSelector((state) => state.comments.comments);
    const commentTextInputRef = useRef(null);

    // New Comment to upload to post.
    const [commentInput, setCommentInput] = useState("");

    // New Comment Creation
    const onSubmitNewComment = (event) => {
        event.preventDefault();
        onLoadingStart("Global");

        dispatch(createNewComment({ post_id: postID, comment_content: commentInput })).then(
            (action) => {
                onLoadingEnd("Global");

                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    // Debug
                    //console.log("[On Comment Creation Failed] Payload.", action.payload);

                    //setError({
                    //    name: action.payload.code,
                    //    code: action.payload.status
                    //});
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    console.log("[On Comment Creation Successful] Payload.", action.payload);

                    setCommentInput("");

                    const newPost = {
                        post_id: post.post_id,
                        post_content: post.post_content,
                        liked: post.liked,
                        like_count: post.like_count,
                        comment_count: action.payload.client_data.post.comment_count,
                        views: post.views,
                        created_at: post.created_at
                    };
                    setPost(newPost);
                }
            }
        );
    };

    // New Comment to modify/delete.
    const [targetComment, setTargetComment] = useState(null);

    const onCommentChanged = (event) => {
        setCommentInput(event.target.value);

        // Auto Text Input Resize (Expansion and Shrink)
        if (commentTextInputRef.current) {
            commentTextInputRef.current.style.height = 'auto';
            commentTextInputRef.current.style.height = `${commentTextInputRef.current.scrollHeight}px`;
        }
    }
    // ===========================================
    // Posts Modifications/Deletions
    const [postDate, setPostDate] = useState(new Date());

    const [showModifyPost, setShowModifyPost] = useState(false);
    const onCloseModifyPostModalCallback = () => setShowModifyPost(false);
    const onShowModifyPostModalCallback = () => setShowModifyPost(true);

    const onModifyPost = () => onShowModifyPostModalCallback();

    const [showDeletePost, setShowDeletePost] = useState(false);
    const onCloseDeletePostModalCallback = () => setShowDeletePost(false);
    const onShowDeletePostModalCallback = () => setShowDeletePost(true);

    const onDeletePost = () => onShowDeletePostModalCallback();
    // ============
    // Comments Modifications/Deletions
    const [showModifyComment, setShowModifyComment] = useState(false);
    const onCloseModifyCommentModalCallback = () => setShowModifyComment(false);
    const onShowModifyCommentModalCallback = () => setShowModifyComment(true);

    const onModifyComment = (currentComment) => {
        setTargetComment(currentComment);
        onShowModifyCommentModalCallback();
    };

    const [showDeleteComment, setShowDeleteComment] = useState(false);
    const onCloseDeleteCommentModalCallback = () => setShowDeleteComment(false);
    const onShowDeleteCommentModalCallback = () => setShowDeleteComment(true);

    const onDeleteComment = (currentComment) => {
        setTargetComment(currentComment);
        onShowDeleteCommentModalCallback();
    };
    // ===========================================
    const onClickReturnToProfile = () => navigate("/profile");
    const onClickLikeButton = () => {
        if (!post)
            return;

        setLikeLoaderVisibility(true);

        if (post.liked === "False") {
            dispatch(likeAPost({ post_id: postID })).then(
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

                        const newPost = {
                            post_id: post.post_id,
                            post_content: post.post_content,
                            liked: "True",
                            like_count: action.payload.client_data.post.like_count,
                            comment_count: post.comment_count,
                            views: post.views,
                            created_at: post.created_at
                        };

                        setPost(newPost);
                    }
                }
            );
        }
        else {
            dispatch(unlikeAPost({ post_id: postID })).then(
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

                        const newPost = {
                            post_id: post.post_id,
                            post_content: post.post_content,
                            liked: "False",
                            like_count: action.payload.client_data.post.like_count,
                            comment_count: post.comment_count,
                            views: post.views,
                            created_at: post.created_at
                        };

                        setPost(newPost);
                    }
                }
            );
        }
    };
    // ===========================================
    const activeUserObj = useSelector((state) => state.activeUser);
    const activeUser = activeUserObj.user;
    // ===========================================
    return (
        <>
            <Col className="col-md-5 col-9 bg-light m-0 p-0 bg-secondary" style={{ border: "1px solid lightgrey", minHeight: "100vh" }}>
                { /* --------------------------------------- */}
                {/* Post Title */}
                <div className="d-flex align-items-center mt-2 mb-3">
                    <Button className="me-2" variant="link" onClick={onClickReturnToProfile} style={{ color: "black", fontWeight: "black" }}>
                        <i className="fs-6 bi bi-arrow-left"></i>
                    </Button>
                    <p className="fs-4 fw-bold m-0 p-0">Post</p>
                </div>
                { /* --------------------------------------- */}
                {/* Post Header (Poster's Identity, Profile Image, Modify/Delete Post Features) */}
                <div className="d-flex align-items-center mt-2 mb-3 ms-3">
                    <Image src={activeUser.profile_image ? activeUser.profile_image : defaultProfileImage}
                        onClick={onClickReturnToProfile}
                        className="me-3"
                        style={{ minWidth: "32px", minHeight: "32px", maxWidth: "48px", maxHeight: "48px", width: "100%", height: "auto", cursor: "pointer" }} />
                    <div>
                        <p className="fs-6 fw-bold m-0 p-0">
                            {activeUser.first_name + " " + activeUser.last_name}
                        </p>
                        <p className="m-0 p-0" style={{ color: "#444444", fontSize: "0.8em" }}>
                            @{(activeUser.first_name + activeUser.last_name).replace(" ", "")}
                        </p>
                    </div>
                    {/* Post Modification/Deletion Tools */}
                    {
                        post ? (
                            <div className="d-flex ms-auto">
                                <div className="ms-auto">
                                    <Button variant="light" onClick={onModifyPost}>
                                        <i className="bi bi-screwdriver"></i>
                                    </Button>
                                    <Button variant="light" onClick={onDeletePost}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </div>
                            </div>
                        ) : null
                    }
                </div>
                { /* --------------------------------------- */}
                {/* Post Content */}
                {
                    postLoaderVisibility && (
                        <div className="d-flex justify-content-center mt-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )
                }
                {
                    postLoaderVisibility ? null : (post ? (
                        <>
                            {/* Timestamp row */}
                            <div className="mx-3">
                                <div className="mb-2">
                                    <p className="fs-6 m-0 p-0">
                                        {post.post_content}
                                    </p>
                                </div>
                                <div className="d-flex mb-2">
                                    <p className="m-0 p-0" style={{ fontSize: "0.8em" }}>
                                        {formatTime(postDate, true)} • {formatDate(postDate, true)} • <span className="fw-bold">{post.views}</span> views
                                    </p>
                                </div>
                            </div>

                            <hr className="m-2" style={{ borderColor: "#777777" }} />

                            {/* Buttons Row */}
                            <div className="d-flex justify-content-between mx-4">
                                <Button variant="light">
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

                            <hr className="m-2" style={{ borderColor: "#777777" }} />

                            {/* Post a reply row */}
                            <Form onSubmit={onSubmitNewComment}>
                                <Col className="col-12 d-flex align-items-center rounded bg-light" style={{ border: "none" }}>
                                    <Image src={activeUser.profile_image ? activeUser.profile_image : defaultProfileImage}
                                        className="ms-2 me-3"
                                        style={{ minWidth: "32px", minHeight: "32px", maxWidth: "48px", maxHeight: "48px", width: "100%", height: "auto", cursor: "pointer" }} />
                                    <Form.Control required as="textarea" value={commentInput}
                                        ref={commentTextInputRef} rows={1}
                                        className="bg-light"
                                        placeholder="Post your comment/reply here"
                                        style={{ resize: "none", overflow: "hidden", border: "none", minHeight: "38px", maxHeight: "200px" }}
                                        onChange={onCommentChanged} />
                                    <Button type="submit" className="mx-2 my-3">
                                        Reply
                                    </Button>
                                </Col>
                            </Form>

                            <hr className="m-2" style={{ borderColor: "#777777" }} />

                            {/* Comments rows */}
                            {
                                comments.map((comment, index) => (
                                    <div key={`comment-${index}`}>
                                        <CommentCard
                                            post={post} comment={comment}
                                            onModifyCallback={onModifyComment}
                                            onDeleteCallback={onDeleteComment} />
                                        <hr className="m-2" style={{ borderColor: "#777777" }} />
                                    </div>
                                ))
                            }
                        </>
                    ) : null)
                }
                { /* --------------------------------------- */}
            </Col>

            <ModifyPostModal show={showModifyPost} post={post}
                onCloseModalCallback={onCloseModifyPostModalCallback} />
            <DeletePostModal show={showDeletePost} post={post}
                onCloseModalCallback={onCloseDeletePostModalCallback}
                onAfterDeleteCallback={() => navigate("/profile")} />

            <ModifyCommentModal show={showModifyComment} comment={targetComment}
                onCloseModalCallback={onCloseModifyCommentModalCallback} />
            <DeleteCommentModal show={showDeleteComment} post={post} comment={targetComment}
                onCloseModalCallback={onCloseDeleteCommentModalCallback}
                onAfterDeleteCallback={(result) => {
                    const newPost = {
                        post_id: post.post_id,
                        post_content: post.post_content,
                        liked: post.liked,
                        like_count: post.like_count,
                        comment_count: result.comment_count,
                        views: post.views,
                        created_at: post.created_at
                    };

                    setPost(newPost);
                }} />
        </>
    );
}
// =========================================