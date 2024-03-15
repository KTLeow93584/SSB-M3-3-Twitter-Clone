// =========================================
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { getSessionToken, callServerAPI } from '../apis/authApi.jsx';
// =========================================
export default function NewPostModal({ show, onCloseModalCallback }) {
    const [postContent, setPostContent] = useState("");

    const onSaveNewPost = () => {
        // Retrieve Stored JWToken.
        const token = getSessionToken();

        // Decode the token to fetch user id.
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const username = decodedToken.username;

        // Prepare data to be sent to API.
        const data = {
            title: "Post Title",
            content: postContent,
            author: username,
            user_id: userId
        };

        // API Call
        callServerAPI("post", "POST", data,
            // On Successful Callback
            (data) => {
                // Debug
                //console.log("[New Post] Returned Data.", data);

                const timeEvent = new CustomEvent("On Create New Post", {
                    detail: data.new_post
                });
                window.dispatchEvent(timeEvent);

                if (onCloseModalCallback)
                    onCloseModalCallback();
            },
            // On Failed Callback
            (error) => {
                console.error("Error", error);
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
                            <Form.Control
                                placeholder="What is happening?!"
                                as="textarea"
                                rows={3}
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