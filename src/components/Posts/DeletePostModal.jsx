// =========================================
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { deletePost } from '../../feature/posts/postsSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../../data/loaders.js';
// =========================================
export default function DeletePostModal({ show, post, onCloseModalCallback, onAfterDeleteCallback = null }) {
    // =====================
    const [error, setError] = useState(null);

    const onCloseModal = () => {
        setError(null);
        if (onCloseModalCallback)
            onCloseModalCallback();
    };
    // =====================
    const dispatch = useDispatch();

    const onDeletePost = () => {
        onLoadingStart("Global");
        setError(null);

        dispatch(deletePost({ post_id: post.post_id })).then(
            (action) => {
                onLoadingEnd("Global");

                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    // Debug
                    //console.log("[On Post Deletion Failed] Payload.", action.payload);

                    setError({
                        name: action.payload.code,
                        code: action.payload.status
                    });
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    //console.log("[On Post Deletion Successful] Payload.", action.payload);

                    if (onAfterDeleteCallback)
                        onAfterDeleteCallback();

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
                    <Modal.Title>Confirm Post Deletion?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postContent">
                            <Form.Control disabled
                                placeholder="What is happening?!"
                                as="textarea"
                                rows={3}
                                value={post ? post.post_content : ""} />
                        </Form.Group>
                    </Form>
                    {/* Error Message Highlight */}
                    {
                        error ? (
                            <p className="fs-6 text-danger">
                                Something went wrong with the post deletion process. (Error: {error.name}, Code: {error.code})
                            </p>
                        ) : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onDeletePost}>
                        Yes
                    </Button>
                    <Button variant="primary" className="rounded-pill" onClick={onCloseModal}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================