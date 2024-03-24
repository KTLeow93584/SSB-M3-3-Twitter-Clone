// =========================================
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { createANewPost } from '../../feature/posts/postsSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../../data/loaders.js';
// =========================================
export default function NewPostModal({ show, onCloseModalCallback }) {
    // =====================
    const [error, setError] = useState(null);
    // =====================
    const [postContent, setPostContent] = useState("");
    // =====================
    const dispatch = useDispatch();

    const onCreateNewPost = () => {
        onLoadingStart("Global");
        setError(null);

        dispatch(createANewPost({ post_content: postContent })).then(
            (action) => {
                onLoadingEnd("Global");

                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    // Debug
                    //console.log("[On Post Creation Failed] Payload.", action.payload);

                    setError({
                        name: action.payload.code,
                        code: action.payload.status
                    });
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    console.log("[On Post Creation Successful] Payload.", action.payload);

                    setPostContent("");

                    if (onCloseModalCallback)
                        onCloseModalCallback();
                }
            }
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
                            <p className="fs-6 text-danger mt-3 mb-0 mx-0 p-0">
                                Something went wrong with the post creation process. (Error: {error.name}, Code: {error.code})
                            </p>
                        ) : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onCreateNewPost}>
                        Tweet
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================