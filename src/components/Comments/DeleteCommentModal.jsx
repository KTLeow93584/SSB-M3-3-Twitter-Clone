// =========================================
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { deleteComment } from '../../feature/comments/commentsSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../../data/loaders.js';
// =========================================
export default function DeleteCommentModal({ show, post, comment, onCloseModalCallback, onAfterDeleteCallback = null }) {
    // =====================
    const [error, setError] = useState(null);

    const onCloseModal = () => {
        setError(null);
        if (onCloseModalCallback)
            onCloseModalCallback();
    };
    // =====================
    const dispatch = useDispatch();

    const onDeleteComment = () => {
        onLoadingStart("Global");
        setError(null);

        dispatch(deleteComment({ post_id: post.post_id, comment_id: comment.comment_id })).then(
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
                        onAfterDeleteCallback({ comment_count: action.payload.client_data.post.comment_count });

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
                                value={comment ? comment.comment_content : ""} />
                        </Form.Group>
                    </Form>
                    {/* Error Message Highlight */}
                    {
                        error ? (
                            <p className="fs-6 text-danger">
                                Something went wrong with the comment deletion process. (Error: {error.name}, Code: {error.code})
                            </p>
                        ) : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onDeleteComment}>
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