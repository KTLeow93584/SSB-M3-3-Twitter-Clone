import { useEffect, useSelector } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import NavigationPanel from '../components/NavigationPanel.jsx';
import ProfileSideBar from '../components/ProfileSideBar.jsx';
import ProfileMidBody from '../components/ProfileMidBody.jsx';

import { updateSessionToken } from '../apis/authApi.jsx';
import { logout } from '../feature/activeUser/activeUserSlice.jsx';
// =========================================
export default function ProfilePage() {
    const dispatch = useDispatch();

    const onLogoutCallback = () => {
        // Clear the token from the local storage.
        updateSessionToken("");
        dispatch(logout());
    };

    return (
        <>
            <Container>
                <Row>
                    <ProfileSideBar handleLogout={onLogoutCallback} />
                    <ProfileMidBody />
                </Row>
            </Container>
        </>
    );
}
// =========================================