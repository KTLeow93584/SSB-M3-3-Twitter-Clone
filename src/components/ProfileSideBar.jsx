// =========================================
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import NewPostModal from './NewPostModal.jsx';
import IconButton from '../components/IconButton.jsx';
// =========================================
export default function ProfileSideBar({ onLogoutCallback }) {
    const [show, setShow] = useState(false);

    const onCloseModalCallback = () => setShow(false);
    const onShowModalCallback = () => setShow(true);

    return (
        <Col className="col-sm-8 col-md-4 col-lg-3 d-flex flex-column justify-content-start align-items-start bg-light vh-100"
            style={{ position: "sticky", top: 0 }}>
            <IconButton className="bi bi-twitter" isTop />
            <IconButton className="bi bi-house" text="Home" />
            <IconButton className="bi bi-search" text="Explore" />
            <IconButton className="bi bi-bell" text="Notifications" />
            <IconButton className="bi bi-envelope" text="Messages" />
            <IconButton className="bi bi-journal-text" text="Lists" />
            <IconButton className="bi bi-bookmark" text="Bookmarks" />
            <IconButton className="bi bi-patch-check" text="Verified" />
            <IconButton className="bi bi-person" text="Profile" />
            <IconButton className="bi bi-filter-circle" text="More" />
            <IconButton className="bi bi-door-closed" text="Logout" onClick={onLogoutCallback} />
            <Button className="rounded-pill w-100 mb-3" onClick={onShowModalCallback}>
                Tweet
            </Button>
            <NewPostModal show={show} onCloseModalCallback={onCloseModalCallback} />
        </Col>
    );
}
// =========================================