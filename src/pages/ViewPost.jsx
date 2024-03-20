import { useDispatch } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import ProfileSideBarLeft from '../components/ProfileSideBarLeft.jsx';
import PostMidBody from '../components/PostMidBody.jsx';
import ProfileSideBarRight from '../components/ProfileSideBarRight.jsx';

import { updateSessionToken } from '../apis/authApi.jsx';
import { logout } from '../feature/activeUser/activeUserSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
// =========================================
export default function ViewPost() {
    const dispatch = useDispatch();

    const onLogoutCallback = () => {
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
                }
            }
        );
    };

    return (
        <>
            <Container fluid className="bg-light" style={{ flex: 1 }}>
                <Row className="d-flex justify-content-center">
                    <ProfileSideBarLeft onLogoutCallback={onLogoutCallback} />
                    <PostMidBody />
                    <ProfileSideBarRight />
                </Row>
            </Container>
        </>
    );
}
// =========================================