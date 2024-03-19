// =========================================
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { updatePost } from '../feature/posts/postsSlice.jsx';
// =========================================
export default function ModifyPostModal({ show, post, onCloseModalCallback }) {
    // =====================
    const [postContent, setPostContent] = useState(post ? post.content : "");
    useEffect(() => {
        setPostContent(post ? post.content : "");
    }, [post]);
    // =====================
    const dispatch = useDispatch();

    const onModifyExistingPost = () => {
        dispatch(updatePost({ id: post.id, content: postContent })).then(
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
                    <Modal.Title>Modify Tweet Post</Modal.Title>
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
                    <Button variant="primary" className="rounded-pill" onClick={onModifyExistingPost}>
                        Re-Tweet
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================