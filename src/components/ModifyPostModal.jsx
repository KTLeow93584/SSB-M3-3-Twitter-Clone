// =========================================
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { updatePost } from '../feature/posts/postsSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
// =========================================
export default function ModifyPostModal({ show, post, onCloseModalCallback }) {
    // =====================
    const [error, setError] = useState(null);

    const onCloseModal = () => {
        setError(null);
        if (onCloseModalCallback)
            onCloseModalCallback();
    };
    // =====================
    const [postContent, setPostContent] = useState(post ? post.post_content : "");
    useEffect(() => {
        setPostContent(post ? post.post_content : "");
    }, [post]);
    // =====================
    const dispatch = useDispatch();

    const onModifyExistingPost = () => {
        onLoadingStart("Global");
        setError(null);

        dispatch(updatePost({ post_id: post.post_id, post_content: postContent })).then(
            (action) => {
                onLoadingEnd("Global");

                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    // Debug
                    //console.log("[On Post Modification Failed] Payload.", action.payload);

                    setError({
                        name: action.payload.code,
                        code: action.payload.status
                    });
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    //console.log("[On Post Modification Successful] Payload.", action.payload);

                    setPostContent("");

                    if (onCloseModalCallback)
                        onCloseModalCallback();
                }
            }
        );
    };
    // =====================
    return (
        <>
            <Modal show={show} onHide={onCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify Tweet Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postContent">
                            <Form.Control required
                                placeholder="What is happening?!"
                                as="textarea"
                                rows={3}
                                value={postContent}
                                onChange={(event) => setPostContent(event.target.value)} />
                        </Form.Group>
                    </Form>
                    {/* Error Message Highlight */}
                    {
                        error ? (
                            <p className="fs-6 text-danger">
                                Something went wrong with the post modification process. (Error: {error.name}, Code: {error.code})
                            </p>
                        ) : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onModifyExistingPost}>
                        Re-Tweet
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================