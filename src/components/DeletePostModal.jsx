// =========================================
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { deletePost } from '../feature/posts/postsSlice.jsx';
// =========================================
export default function DeletePostModal({ show, post, onCloseModalCallback }) {
    // =====================
    const dispatch = useDispatch();

    const onDeletePost = () => {
        dispatch(deletePost(post.id)).then(
            // On Promise Fulfilled
            () => {
                if (onCloseModalCallback)
                    onCloseModalCallback();
            },
            // On Promise Rejected/Failed
            null
        );
    };
    // =====================
    return (
        <>
            <Modal show={show} onHide={onCloseModalCallback}>
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
                                value={post ? post.content : ""} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onDeletePost}>
                        Yes
                    </Button>
                    <Button variant="primary" className="rounded-pill" onClick={onCloseModalCallback}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================