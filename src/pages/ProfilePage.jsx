// =========================================
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import ProfileSideBarLeft from '../components/ProfileSideBarLeft.jsx';
import ProfileMidBody from '../components/ProfileMidBody.jsx';
import ProfileSideBarRight from '../components/ProfileSideBarRight.jsx';

import { updateSessionToken } from '../apis/authApi.jsx';
import { logout } from '../feature/activeUser/activeUserSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
// =========================================
export default function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    const onLogoutCallback = () => {
        if (auth.currentUser)
            auth.signOut();

        onLoadingStart("Global");

        dispatch(logout()).then(
            (action) => {
                onLoadingEnd("Global");

                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    // Debug
                    //console.log("[On Logout Failed] Payload.", action.payload);
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    //console.log("[On Logout Successful] Payload.", action.payload);
                    updateSessionToken("");
                    navigate("/");
                }
            }
        );
    };

    return (
        <>
            <Container fluid className="bg-light" style={{ flex: 1 }}>
                <Row className="d-flex justify-content-center">
                    <ProfileSideBarLeft onLogoutCallback={onLogoutCallback} />
                    <ProfileMidBody />
                    <ProfileSideBarRight />
                </Row>
            </Container>
        </>
    );
}
// =========================================