// =========================================
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { createANewPost } from '../feature/posts/postsSlice.jsx';
// =========================================
export default function NewPostModal({ show, onCloseModalCallback }) {
    const [postContent, setPostContent] = useState("");
    const dispatch = useDispatch();

    const onSaveNewPost = () => {
        dispatch(createANewPost(postContent)).then(
            // On Promise Fulfilled
            () => {
                if (onCloseModalCallback)
                    onCloseModalCallback();
            },
            // On Promise Rejected/Failed
            null
        );
    };

    return (
        <>
            <Modal show={show} onHide={onCloseModalCallback}>
                <Modal.Header closeButton>
                    <Modal.Title>Create A New Tweet Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postContent">
                            <Form.Control
                                placeholder="What is happening?!"
                                as="textarea"
                                rows={3}
                                value={postContent}
                                onChange={(event) => setPostContent(event.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onSaveNewPost}>
                        Tweet
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================