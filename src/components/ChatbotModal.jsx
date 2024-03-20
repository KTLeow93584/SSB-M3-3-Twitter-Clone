// =========================================
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import { callTPServerAPI } from '../apis/authApi.jsx';
// =========================================
export default function ChatbotModal({ show, user, onCloseModalCallback }) {
    const [message, setMessage] = useState("");
    const [previousMessages, setPreviousMessages] = useState([]);

    const [loaderVisibility, setLoaderVisibility] = useState(false);

    const [error, setError] = useState(null);

    const onCloseModal = () => {
        setError(null);

        if (onCloseModalCallback)
            onCloseModalCallback();
    }

    const sendMessage = async (event) => {
        event.preventDefault();
        setLoaderVisibility(true);

        setError(null);

        const apiURL = "https://api.openai.com/v1/chat/completions";
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

        const messagesToSend = [
            ...previousMessages,
            {
                role: "user",
                content: message
            }
        ];

        callTPServerAPI(apiURL, "POST",
            // Custom Header
            {
                "Authorization": "Bearer " + apiKey,
                "Content-Type": "application/json"
            },
            //Body
            {
                model: "gpt-3.5-turbo",
                messages: messagesToSend
            },
            // On Successful Callback
            (data) => {
                setLoaderVisibility(false);

                let newAllMessages = [
                    ...messagesToSend,
                    data.choices[0].message
                ];
                setPreviousMessages(newAllMessages);
                setMessage("");
            },
            // On Failed Callback
            (error) => {
                setLoaderVisibility(false);

                setError({
                    name: error.code,
                    code: error.status
                });
            }
        );

    };

    return (
        <Modal show={show} onHide={onCloseModal} size="lg">
            <Modal.Header closeButton className="fs-4">
                AI Chatbot
            </Modal.Header>
            <Modal.Body>
                <div>
                    {previousMessages.map((message, index) => (
                        <p key={index}>
                            <strong>{message.role === "user" ? (user.first_name + " " + user.last_name) : "ChatGPT OpenAI Bot"}: </strong>
                            {message.content}
                        </p>
                    ))}
                </div>
                {
                    loaderVisibility ? (
                        <div className="d-flex justify-content-center mt-2 mb-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : null
                }

                <Form onSubmit={sendMessage}>
                    <Form.Control type="text"
                        placeholder="Ask chatbot something"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)} />
                    {
                        error ? (
                            <p className="fs-6 text-danger m-0 p-0">
                                Something went wrong with the AI Chatbot process. (Error: {error.name}, Code: {error.code})
                            </p>
                        ) : null
                    }

                    <Button type="submit" className="mt-3">Send</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
// =========================================