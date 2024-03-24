// =========================================
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import NewPostModal from '../Posts/NewPostModal.jsx';
import IconButton from '../IconButton.jsx';

import ChatbotModal from '../ChatbotModal.jsx';
// =========================================
export default function ProfileSideBarLeft({ onLogoutCallback }) {
    // =======================
    const navigate = useNavigate();
    // =======================
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);

    const onCloseChatbotModal = () => setShowChatbot(false);
    const onShowChatbotModal = () => setShowChatbot(true);

    const onCloseNewPostModal = () => setShowNewPostModal(false);
    const onShowNewPostModal = () => setShowNewPostModal(true);
    // =======================
    const activeUserObj = useSelector((state) => state.activeUser);
    const activeUser = activeUserObj.user;
    // =======================
    const onMoveToProfileCallback = () => navigate("/home");
    // =======================
    return (
        <Col className="col-md-3 col-lg-3 col-3 d-flex flex-column justify-content-start align-items-start"
            style={{ position: "sticky", top: 0 }}>
            <IconButton iconClassName="bi bi-twitter" isTop onClick={onMoveToProfileCallback} />
            <IconButton iconClassName="bi bi-house" text="Home" onClick={onMoveToProfileCallback} />
            <IconButton iconClassName="bi bi-search text-danger" textClassName="text-danger" text="Explore" />
            <IconButton iconClassName="bi bi-bell text-danger" textClassName="text-danger" text="Notifications" />
            <IconButton iconClassName="bi bi-envelope text-danger" textClassName="text-danger" text="Messages" />
            <IconButton iconClassName="bi bi-journal-text text-danger" textClassName="text-danger" text="Lists" />
            <IconButton iconClassName="bi bi-bookmark text-danger" textClassName="text-danger" text="Bookmarks" />
            <IconButton iconClassName="bi bi-patch-check text-danger" textClassName="text-danger" text="Verified" />
            <IconButton iconClassName="bi bi-person" text="Profile" onClick={onMoveToProfileCallback} />
            <IconButton iconClassName="bi bi-chat-square-text" text="Chatbot" onClick={onShowChatbotModal} />
            <IconButton iconClassName="bi bi-door-closed" text="Logout" onClick={onLogoutCallback} />

            <br />

            <Button className="rounded-pill w-100 mb-3" onClick={onShowNewPostModal}>
                Tweet
            </Button>

            <NewPostModal show={showNewPostModal} onCloseModalCallback={onCloseNewPostModal} />
            <ChatbotModal show={showChatbot} user={activeUser} onCloseModalCallback={onCloseChatbotModal} />
        </Col>
    );
}
// =========================================