// =========================================
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { updateComment } from '../feature/comments/commentsSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
// =========================================
export default function ModifyCommentModal({ show, comment, onCloseModalCallback, onAfterModifyCallback = null }) {
    // =====================
    const [error, setError] = useState(null);

    const onCloseModal = () => {
        setError(null);
        if (onCloseModalCallback)
            onCloseModalCallback();
    };
    // =====================
    const [commentContent, setCommentContent] = useState(comment ? comment.comment_content : "");

    useEffect(() => {
        setCommentContent(comment ? comment.comment_content : "");
    }, [comment]);
    // =====================
    const dispatch = useDispatch();

    const onModifyExistingComment = () => {
        onLoadingStart("Global");
        setError(null);

        dispatch(updateComment({ comment_id: comment.comment_id, comment_content: commentContent })).then(
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

                    setCommentContent("");

                    if (onAfterModifyCallback)
                        onAfterModifyCallback();

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
                    <Modal.Title>Modify Tweet Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postContent">
                            <Form.Control required
                                placeholder="Leave your comment here?!"
                                as="textarea"
                                rows={3}
                                value={commentContent}
                                onChange={(event) => setCommentContent(event.target.value)} />
                        </Form.Group>
                    </Form>
                    {/* Error Message Highlight */}
                    {
                        error ? (
                            <p className="fs-6 text-danger">
                                Something went wrong with the comment modification process. (Error: {error.name}, Code: {error.code})
                            </p>
                        ) : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onModifyExistingComment}>
                        Re-Tweet
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================