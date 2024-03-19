
// =========================================
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';

import { logout } from '../feature/activeUser/activeUserSlice.jsx';
import { updateSessionToken } from '../apis/authApi.jsx';

import defaultProfileImage from "../assets/images/user-profile-default.webp";
// =========================================
export default function NavigationPanel({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogoutCallback = () => {
        dispatch(logout()).then(
            // On Promise Fulfilled, clear the token from the local storage.
            () => updateSessionToken(""),
            // On Promise Rejected/Failed
            null
        );
    };

    return (
        <Navbar bg="light">
            <Container fluid>
                <Navbar.Brand as={Link} to={user ? "/profile" : "/"} className="ms-4">
                    <i className="bi bi-twitter" style={{ fontSize: 30, color: "dodgerblue" }}></i>
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Image onClick={() => navigate("/profile")}
                        src={user.profile_image ? user.profile_image : defaultProfileImage}
                        rounded style={{
                            minWidth: "16px", minHeight: "16px", maxWidth: "32px", maxHeight: "32px",
                            width: "100%", height: "auto", cursor: "pointer"
                        }} />
                    <Button variant="link" className="nav-panel-text"
                        onClick={() => navigate("/profile")}>
                        {user.first_name + " " + user.last_name}
                    </Button>
                    <Button variant="link" className="nav-panel-text"
                        onClick={onLogoutCallback}>
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}
// =========================================