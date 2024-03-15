
// =========================================
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';

import { logout } from '../feature/activeUser/activeUserSlice.jsx';

import { callServerAPI, updateSessionToken } from '../apis/authApi.jsx';

import defaultProfileImage from "../assets/images/user-profile-default.webp";
// =========================================
export default function NavigationPanel({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onBrowseUsersCallback = () => {
        callServerAPI("users/1", "GET", null,
            // On Successful Callback
            (result) => {
                // Debug
                //console.log("[Users Query] Results.", result);

                const users = result.map((user) => ({
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    profileImage: user.profile_image,
                    followed: user.followed,
                    totalFollowers: user.total_followers
                }));
                navigate("/users", {
                    state: { users: users }
                });
            },
            // On Failed Callback
            (error) => {
                // Debug
                console.log("Error.", error);
            }
        );
    };

    const onEditProfileCallback = () => {
        navigate("/editProfile");
    };

    const onLogoutCallback = () => {
        // Clear the token from the local storage.
        updateSessionToken("");
        dispatch(logout());
    };

    return (
        <Navbar bg="light">
            <Container>
                <Navbar.Brand as={Link} to={user ? "/profile" : "/"}>
                    <i className="bi bi-twitter" style={{ fontSize: 30, color: "dodgerblue" }}></i>
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Image onClick={() => navigate("/profile")}
                        src={user.profileImage ? new URL(user.profileImage, import.meta.url) : defaultProfileImage}
                        className="me-3"
                        style={{ minWidth: "16px", minHeight: "16px", maxWidth: "32px", maxHeight: "32px", width: "100%", height: "auto", cursor: "pointer" }} />
                    <Button variant="link" className="me-2"
                        onClick={onBrowseUsersCallback}>
                        Browse Users
                    </Button>
                    <Button variant="link" className="me-2"
                        onClick={onEditProfileCallback}>
                        Edit Profile
                    </Button>
                    <Button variant="link"
                        onClick={onLogoutCallback}>
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
// =========================================