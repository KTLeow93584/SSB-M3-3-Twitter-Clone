// =========================================
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
// =========================================
export default function ChatbotModal({ show, onCloseModalCallback }) {
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);

    const sendMessage = async (event) => {
        event.preventDefault();
        const apiURL = "https://api.openai.com/v1/chat/completions";
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

        const messagesToSend = [
            ...allMessages,
            {
                role: "user",
                content: message
            }
        ];

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messaages: messagesToSend
            })
        });

        const data = await response.json();

        if (data) {
            let newAllMessages = [
                ...messagesToSend,
                data.choices[0].message
            ];
            setAllMessages(newAllMessages);
            setMessage("");
        }
    };

    return (
        <Modal show={show} onHide={onCloseModalCallback} size="lg">
            <Modal.Header closeButton className="fs-4">
                AI Chatbot
            </Modal.Header>
            <Modal.Body>
                <div>
                    {allMessages.map((message, index) => (
                        <p key={index}>
                            <strong>{message.role}</strong> {message.content}
                        </p>
                    ))}
                </div>

                <Form onSubmit={sendMessage}>
                    <Form.Control type="text"
                        placeholder="Ask chatbot something"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)} />

                    <Button type="submit" className="mt-3">Send</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
// =========================================