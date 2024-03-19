import { useDispatch } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import ProfileSideBar from '../components/ProfileSideBar.jsx';
import ProfileMidBody from '../components/ProfileMidBody.jsx';

import { updateSessionToken } from '../apis/authApi.jsx';
import { logout } from '../feature/activeUser/activeUserSlice.jsx';
// =========================================
export default function ProfilePage() {
    const dispatch = useDispatch();

    const onLogoutCallback = () => {
        dispatch(logout()).then(
            // On Promise Fulfilled, clear the token from the local storage.
            () => updateSessionToken(""),
            // On Promise Rejected/Failed
            null
        );
    };

    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <ProfileSideBar onLogoutCallback={onLogoutCallback} />
                    <ProfileMidBody />
                </Row>
            </Container>
        </>
    );
}
// =========================================